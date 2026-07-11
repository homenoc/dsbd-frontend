import React, { useEffect, useState } from 'react'
import { CardActions, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { InfosData } from '../../../interface'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import store, { RootState } from '../../../store'
import { clearInfos, clearTemplates } from '../../../store/action/Actions'
import { useSelector } from 'react-redux'
import { Get } from '../../../api/Info'
import Dashboard from '../../../components/Dashboard/Dashboard'
import { ConnectionListDeleteDialog } from './ConnectionListDeleteDialog'
import { ConnectionListChangeDialog } from './ConnectionListChangeDialog'
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../../style'

export default function ConnectionList() {
  const [infos, setInfos] = useState<InfosData[]>([])
  const [initInfos, setInitInfos] = useState<InfosData[]>([])
  const info = useSelector((state: RootState) => state.infos)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // info
    const length = info.length
    const tmpData = info[length - 1]

    if (tmpData.error !== undefined || tmpData.data != null) {
      if (tmpData.error !== undefined) {
        if (tmpData.error?.indexOf('[401]') !== -1) {
          Cookies.remove('user_token')
          Cookies.remove('access_token')
          store.dispatch(clearInfos())
          store.dispatch(clearTemplates())
          enqueueSnackbar(tmpData.error, { variant: 'error' })
          navigate('/')
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
  }, [info])

  const handleFilter = (search: string) => {
    let tmp: InfosData[]
    if (search === '') {
      tmp = initInfos
    } else {
      tmp = initInfos.filter((tmpInfo: InfosData) => {
        const serviceId = tmpInfo.service_id
        return serviceId.toLowerCase().includes(search.toLowerCase())
      })
    }
    setInfos(tmp)
  }

  return (
    <Dashboard title="接続変更/廃止手続き">
      <StyledCardRoot3>
        <CardContent>
          接続変更手続き（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報を変更、IPアドレスの廃止をご希望の方もお選びください。）
          <br />
          接続削除手続き（サービスに属している接続も廃止になりますのでご注意ください。）
        </CardContent>
      </StyledCardRoot3>
      <br />
      <StyledPaperRootInput>
        <StyledSearchInput
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      {infos == null && <h3>現在、有効なサービスはありません。</h3>}
      {infos != null &&
        infos.map((tmpInfo: InfosData, index) => (
          <StyledCardRoot3 key={'info_' + index}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {tmpInfo.service_id}
              </Typography>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                {/*ID: {tmpInfo.id}*/}
              </StyledTypographyTitle>
              &nbsp;
              {/*<Pass key={"pass" + index} pass={connection.open}/>*/}
              <br />
            </CardContent>
            <CardActions>
              <ConnectionListChangeDialog
                key={'connection_list_change_dialog'}
                info={tmpInfo}
              />
              <ConnectionListDeleteDialog
                key={'connection_list_delete_dialog'}
                info={tmpInfo}
              />
            </CardActions>
          </StyledCardRoot3>
        ))}
    </Dashboard>
  )
}
