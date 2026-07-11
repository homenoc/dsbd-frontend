import React, { useEffect } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { StyledCardHeader1, StyledDivCardPricing } from './styles'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import store, { RootState } from '../../store'
import { InfoData, TemplateData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { Get, GetTemplate } from '../../api/Info'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './payment.scss'
import { StyledContainer1 } from '../../style'
import { restfulApiConfig } from '../../api/Config'
import { GetPayment, PostSubscribe } from '../../api/payment'

export default function Payment() {
  const [data, setData] = React.useState<InfoData>()
  const [template, setTemplate] = React.useState<TemplateData>()
  const infos = useSelector((state: RootState) => state.infos)
  const templates = useSelector((state: RootState) => state.templates)
  const navigate = useNavigate()
  const [isStatus, setIsStatus] = React.useState(0)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // info
    const length = infos.length
    const tmpData = infos[length - 1]

    if (tmpData.error !== undefined || tmpData.data != null) {
      if (tmpData.error !== undefined) {
        if (tmpData.error?.indexOf('[401]') !== -1) {
          Cookies.remove('user_token')
          Cookies.remove('access_token')
          store.dispatch(clearInfos())
          store.dispatch(clearTemplates())
          enqueueSnackbar(tmpData.error, { variant: 'error' })
          navigate('/login')
        } else {
          enqueueSnackbar(tmpData.error, { variant: 'error' })
        }
      } else if (tmpData.data != null) {
        if (tmpData.data?.group?.expired_status !== 0) {
          navigate('/dashboard')
        }
        setData(tmpData.data)

        if (tmpData.data.user?.group_id == null) {
          setIsStatus(1)
        } else if ((tmpData.data.group?.member_type_id ?? 0) >= 50) {
          setIsStatus(2)
        } else if (tmpData.data.info?.length == null) {
          setIsStatus(3)
        } else if (
          tmpData.data.group?.is_stripe_id &&
          tmpData.data.group?.is_expired
        ) {
          setIsStatus(4)
        } else if (!tmpData.data.group?.is_expired) {
          setIsStatus(5)
        }
      }
    } else {
      Get().then()
      const date = new Date()
      enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
        variant: 'info',
      })
    }

    // template
  }, [infos, templates])

  useEffect(() => {
    GetTemplate().then((res) => {
      if (typeof res === 'object') {
        setTemplate(res)
      } else {
        enqueueSnackbar(res, { variant: 'error' })
        if (res.indexOf('[401]') !== -1) {
          Cookies.remove('user_token')
          Cookies.remove('access_token')
          store.dispatch(clearInfos())
          store.dispatch(clearTemplates())
          enqueueSnackbar(res, { variant: 'error' })
          navigate('/login')
        }
      }
    })
  }, [])

  const subscribe = (plan: string) => {
    PostSubscribe(plan).then((res) => {
      if (res.error === '') {
        window.open(res.data, '_blank')
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const getPayment = () => {
    GetPayment().then((res) => {
      if (res.error === '') {
        window.open(res.data, '_blank')
      } else {
        enqueueSnackbar(String(res.error), { variant: 'error' })
      }
    })
  }

  const DonatePage = () => {
    window.open(restfulApiConfig.donateURL, '_blank')
  }

  return (
    <DashboardComponent title="Payment">
      <StyledContainer1 maxWidth="sm">
        {/*<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>*/}
        {/*    Payment*/}
        {/*</Typography>*/}
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          当団体ではネットワーク接続などをご利用頂いている皆様に「会費」として運営費用の一部を負担して頂くことになりました。
          {/*今後も継続して活動を続けていくために、運営費用の一部を利用者の皆様に負担していただく予定です。*/}
        </Typography>
      </StyledContainer1>
      {data?.group?.coupon_id !== '' && (
        <h2>クーポンID：{data?.group?.coupon_id}</h2>
      )}
      {isStatus === 1 && <h2>グループ未登録のため、この操作は出来ません。</h2>}
      {isStatus === 2 && (
        <h2>{data?.group?.member_type}のため、費用は免除されます。</h2>
      )}
      {isStatus === 3 && <h2>開通処理後、会費の支払いを行ってください。</h2>}
      {isStatus === 4 && (
        <div>
          <h3>期限切れ</h3>
          <p>
            以下の「支払い履歴/情報/プラン変更」から支払い状況を確認してください
          </p>
          <p>
            ご不明な場合などがありましたら、Supportチャットにてご連絡のほどお願いいたします。
          </p>
          <Button variant={'contained'} color="primary" onClick={getPayment}>
            支払い履歴/情報/プラン変更
          </Button>
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>
              有効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}
            </h3>
          )}
        </div>
      )}
      {isStatus === 5 && (
        <div>
          <h3>
            定期支払いを解約する場合は、解約になりますので、「各種手続き ⇛
            退会手続き」をお選びください。
          </h3>
          <br />
          <h2>支払い済みです。</h2>
          <Button variant={'contained'} color="primary" onClick={getPayment}>
            支払い履歴/情報/プラン変更
          </Button>
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>
              有効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}
            </h3>
          )}
        </div>
      )}
      {isStatus === 0 && (
        <Container maxWidth="md" component="main">
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>
              失効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}
            </h3>
          )}
          <h3>支払いを行うと自動定期支払いになりますので、ご注意ください。</h3>
          <Grid container spacing={5} alignItems="flex-end">
            {template?.payment_membership?.map((membership, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card>
                  <StyledCardHeader1
                    title={membership.title}
                    // subheader={tier.subheader}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    // action={tier.title === 'Pro' ? <StarIcon/> : null}
                  />
                  <CardContent>
                    <StyledDivCardPricing>
                      <Typography
                        component="h2"
                        variant="h3"
                        color="textPrimary"
                      >
                        {membership.fee}円
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        /{membership.plan}
                      </Typography>
                    </StyledDivCardPricing>
                    <ul>{/*{membership.comment}*/}</ul>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => subscribe(membership.plan)}
                    >
                      支払う
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <p>失効期限は自動更新時に期限更新されます</p>
        </Container>
      )}
      <br />
      <br />
      <Container>
        <h3>寄付をしてくださる方はこちらからお願いいたします。</h3>
        <Button variant={'contained'} color="primary" onClick={DonatePage}>
          寄付をご希望の方はこちらから
        </Button>
      </Container>

      <h5>決済システムとして、stripeを使用しております。</h5>
    </DashboardComponent>
  )
}
