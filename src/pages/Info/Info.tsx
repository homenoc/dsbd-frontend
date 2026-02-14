import React, { useEffect, useState } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import { useSelector } from 'react-redux'
import store, { RootState } from '../../store'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import { Get } from '../../api/Info'
import { InfosData } from '../../interface'
import {Box, CardContent, Typography} from '@mui/material'
import classesCSS from './style.module.scss'
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../style'

export default function Info() {
  const [infos, setInfos] = useState<InfosData[]>([])
  const [initInfos, setInitInfos] = useState<InfosData[]>([])
  const serviceInfos = useSelector((state: RootState) => state.infos)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // info
    const length = serviceInfos.length
    const tmpData = serviceInfos[length - 1]

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
          Get().then()
        }
      } else if (tmpData.data != null && tmpData.data?.info != null) {
        setInitInfos(tmpData.data?.info)
        setInfos(tmpData.data?.info)
      }
    } else {
      Get().then()
      const date = new Date()
      enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
        variant: 'info',
      })
    }
  }, [serviceInfos])

  const handleFilter = (search: string) => {
    let tmp: InfosData[]
    if (search === '') {
      tmp = initInfos
    } else {
      tmp = initInfos.filter((info: InfosData) => {
        return info.service.toLowerCase().includes(search.toLowerCase())
      })
    }
    setInfos(tmp)
  }

  return (
    <DashboardComponent title="Info">
      <StyledPaperRootInput>
        <StyledSearchInput
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      {(infos == null || infos.length === 0) && (
        <h3>現在、開通しているサービスがありません。</h3>
      )}
      {infos != null &&
        infos.map((info: InfosData, index) => (
          <StyledCardRoot3 key={'info_' + index}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {info.service_id}
              </Typography>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                {info.asn}
              </StyledTypographyTitle>
              <Box className={classesCSS.contract}>
                <br />
                <table aria-colspan={2}>
                  <thead>
                    <tr>
                      <th colSpan={2}>IP</th>
                    </tr>
                    <tr>
                      <th>IP Version</th>
                      <th>Address</th>
                    </tr>
                    {info.v4?.map((v4, index) => (
                      <tr key={'v4_' + index}>
                        <td>IPv4</td>
                        <td>{v4}</td>
                      </tr>
                    ))}
                    {info.v6?.map((v6, index) => (
                      <tr key={'v6_' + index}>
                        <td>IPv6</td>
                        <td>{v6}</td>
                      </tr>
                    ))}
                  </thead>
                </table>
                <br />
                <table aria-colspan={2}>
                  <thead>
                    <tr>
                      <th colSpan={2}>内容</th>
                    </tr>
                    <tr>
                      <th>サービス種別</th>
                      <td>{info.service}</td>
                    </tr>
                    <tr>
                      <th>利用料金</th>
                      <td>{info.fee}</td>
                    </tr>
                    <tr>
                      <th>当団体からのIPアドレスの割当</th>
                      {info.assign && <td>当団体から割当</td>}
                      {!info.assign && <td>貴団体から割当</td>}
                    </tr>
                  </thead>
                </table>
                <br />
                <table className={classesCSS.contract}>
                  <thead>
                    <tr>
                      <th colSpan={3}>接続情報</th>
                    </tr>
                    <tr>
                      <th>接続方式</th>
                      <td colSpan={2}>{info.service}</td>
                    </tr>
                    <tr>
                      <th>接続NOC</th>
                      <td colSpan={2}>{info.noc}</td>
                    </tr>
                    <tr>
                      <th>トンネル終端アドレス（貴団体側）</th>
                      <td colSpan={2}>{info.term_ip}</td>
                    </tr>
                    <tr>
                      <th>トンネル終端アドレス（HomeNOC側）</th>
                      <td colSpan={2}>{info.noc_ip}</td>
                    </tr>
                    <tr>
                      <th>RFC8950利用</th>
                      <td colSpan={2}>{info.rfc8950 ? 'あり' : 'なし'}</td>
                    </tr>
                    <tr>
                      <th colSpan={3}>当団体との間の境界アドレス</th>
                    </tr>
                    <tr>
                      <th />
                      <th>IPv4アドレス</th>
                      <th>IPv6アドレス</th>
                    </tr>
                    <tr>
                      <th>HomeNOC側</th>
                      <td>
                        {info.rfc8950 ? 'RFC8950利用のため無し' : info.link_v4_our}
                      </td>
                      <td>{info.link_v6_our}</td>
                    </tr>
                    <tr>
                      <th>貴団体側</th>
                      <td>
                        {info.rfc8950 ? 'RFC8950利用のため無し' : info.link_v4_your}
                      </td>
                      <td>{info.link_v6_your}</td>
                    </tr>
                  </thead>
                </table>
                <br />
                <Typography component={'span'} variant={'subtitle1'}>
                  本ページは電気通信事業法
                  第26条2（書面の交付義務）に基づく書面となります。
                </Typography>
                <Typography component={'span'} variant={'subtitle1'}>
                  なお、郵送での書面交付をご希望頂いた方は、お送りします書面が正式書面となり、本画面の表示は参考情報となります。
                </Typography>
              </Box>
            </CardContent>
            {/*<CardActions>*/}
            {/*    <Button size="small">Learn More</Button>*/}
            {/*</CardActions>*/}
          </StyledCardRoot3>
        ))}
    </DashboardComponent>
  )
}
