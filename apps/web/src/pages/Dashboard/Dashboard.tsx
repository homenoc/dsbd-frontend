import React, { useEffect } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import store, { RootState } from '../../store'
import { InfoData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { Get } from '../../api/Info'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { restfulApiConfig } from '../../api/Config'
import { StyledCardRoot3, StyledTypographyTitle } from '../../style'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Dashboard() {
  const [data, setData] = React.useState<InfoData>()
  const infos = useSelector((state: RootState) => state.infos)
  const templates = useSelector((state: RootState) => state.templates)
  const navigate = useNavigate()
  const [status, setStatus] = React.useState(3)
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
        setData(tmpData.data)
        // add group
        if (tmpData.data.user?.group_id === 0) {
          setStatus(0)
        } else if (tmpData.data.group?.add_allow) {
          setStatus(1)
        } else {
          if (tmpData.data.service != null) {
            let addAllow = false
            for (const tmpService of tmpData.data.service) {
              if (tmpService.add_allow) {
                addAllow = true
                break
              }
            }
            if (addAllow) {
              setStatus(2)
            }
          } else {
            setStatus(3)
          }
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

  const getStringFromDate = (before: string): string => {
    let str = '無期限'
    if (!before.match(/9999-12-31/)) {
      const date = new Date(Date.parse(before))
      str =
        date.getFullYear() +
        '-' +
        ('0' + (1 + date.getMonth())).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2) +
        ' ' +
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2) +
        ':' +
        ('0' + date.getSeconds()).slice(-2)
    }
    return str
  }

  const moveAddPage = () => {
    navigate('/dashboard/add')
  }

  const movePaymentPage = () => {
    navigate('/dashboard/payment')
  }

  return (
    <DashboardComponent title="Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {data?.user?.group_id !== 0 && data?.group?.expired_status !== 0 && (
            <StyledCardRoot3 key={'payment_notice'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  非アクティブ状態
                </Typography>
                <Chip size={'small'} label="重要" color="secondary" />
                <br />
                <br />
                <Typography component={'span'} variant={'subtitle1'}>
                  アカウントが非アクティブ状態です。
                </Typography>
                <Typography component={'span'} variant={'subtitle1'}>
                  アカウントを再度、アクティブにしたい方はチャットよりお問い合わせのほどお願いします。
                </Typography>
              </CardContent>
            </StyledCardRoot3>
          )}
          {data?.group?.expired_status === 0 &&
            restfulApiConfig.enableMoney &&
            data?.group?.is_expired &&
            !data?.info?.length && (
              <StyledCardRoot3 key={'payment_notice'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    会費のお支払いについて
                  </Typography>
                  <Chip size={'small'} label="重要" color="secondary" />
                  <br />
                  <br />
                  <Typography component={'span'} variant={'subtitle1'}>
                    開通処理が完了致しましたので、会費のお支払いをお願いいたします。
                  </Typography>
                  <Typography component={'span'} variant={'subtitle1'}>
                    （開通処理後に1週間以内に支払いが行われない場合は、未開通処理を行います。）
                  </Typography>
                  <br />
                  以下の「会費のお支払いはこちらから」ボタンより手続きを進めてください
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={movePaymentPage}
                  >
                    会費のお支払いはこちらから
                  </Button>
                </CardActions>
              </StyledCardRoot3>
            )}
          {!(data?.user?.group_id !== 0 && data?.group?.expired_status === 0) &&
            status !== 3 && (
              <StyledCardRoot3 key={'add_notice'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    申請手続きのお知らせ
                  </Typography>
                  <Chip
                    size={'small'}
                    label="重要"
                    color="secondary"
                    sx={{ marginRight: 1 }}
                  />
                  <br />
                  以下の「申請ページはこちら」ボタンより手続きを進めてください
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined" onClick={moveAddPage}>
                    申請ページはこちら
                  </Button>
                </CardActions>
              </StyledCardRoot3>
            )}
          {data?.group?.expired_status === 0 &&
            data?.notice?.map((notice, index) => (
              <StyledCardRoot3 key={index}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {notice.title}
                  </Typography>
                  <StyledTypographyTitle color="textSecondary" gutterBottom>
                    ({getStringFromDate(notice.start_time)} -{' '}
                    {getStringFromDate(notice.end_time)})
                  </StyledTypographyTitle>
                  {notice.info && (
                    <Chip
                      size={'small'}
                      label="情報"
                      color="primary"
                      sx={{ marginRight: 1 }}
                    />
                  )}
                  {notice.important && (
                    <Chip
                      size={'small'}
                      label="重要"
                      color="secondary"
                      sx={{ marginRight: 1 }}
                    />
                  )}
                  {notice.fault && (
                    <Chip
                      size={'small'}
                      label="障害"
                      color="secondary"
                      sx={{ marginRight: 1 }}
                    />
                  )}
                  <br />
                  <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
                    {notice.data}
                  </ReactMarkdown>
                </CardContent>
              </StyledCardRoot3>
            ))}
        </Grid>
        <Grid item xs={12} md={4}>
          {restfulApiConfig.enableMoney && (
            <StyledCardRoot3 key={'student'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  会員情報
                </Typography>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  <Typography component={'span'} variant={'subtitle1'}>
                    会員種別: {data?.group?.member_type}
                  </Typography>
                  <br />
                  {data?.group?.member_expired != null && (
                    <Typography component={'span'} variant={'subtitle1'}>
                      失効期限:{' '}
                      {data?.group?.member_expired.split('T')[0] ?? '---'}
                    </Typography>
                  )}
                  {data?.group?.is_expired && (
                    <h2 color={'secondary'}>期限切れ</h2>
                  )}
                </StyledTypographyTitle>
                <br />
                {data?.group?.is_expired && data?.info?.length == null && (
                  <Box>
                    <Typography component={'span'} variant={'subtitle1'}>
                      開通処理後に、会費の支払いをお願いいたします。
                    </Typography>
                    <Chip size="small" color={'secondary'} label="未払い" />
                  </Box>
                )}
                {data?.group?.is_expired && data?.info?.length != null && (
                  <Box>
                    <Typography component={'span'} variant={'subtitle1'}>
                      支払い手続きを行ってください。
                    </Typography>
                    <Chip size="small" color={'secondary'} label="未払い" />
                  </Box>
                )}
              </CardContent>
            </StyledCardRoot3>
          )}
        </Grid>
      </Grid>
    </DashboardComponent>
  )
}
