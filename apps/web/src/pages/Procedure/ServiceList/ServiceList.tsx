import React, { useEffect, useState } from 'react'
import { CardActions, CardContent, Chip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ServiceData } from '../../../interface'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'
import store, { RootState } from '../../../store'
import { clearInfos, clearTemplates } from '../../../store/action/Actions'
import { useSelector } from 'react-redux'
import { Get } from '../../../api/Info'
import Dashboard from '../../../components/Dashboard/Dashboard'
import { ServiceListChangeDialog } from './ServiceListChangeDialog'
import { ServiceListDeleteDialog } from './ServiceListDeleteDialog'
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../../style'

export default function ServiceList() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [initServices, setInitServices] = useState<ServiceData[]>([])
  const infos = useSelector((state: RootState) => state.infos)
  const navigate = useNavigate()
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
          navigate('/')
        } else {
          enqueueSnackbar(tmpData.error, { variant: 'error' })
          Get().then()
        }
      } else if (tmpData.data != null && tmpData.data?.service != null) {
        setInitServices(tmpData.data?.service)
        setServices(tmpData.data?.service)
      }
    } else {
      Get().then()
      const date = new Date()
      enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
        variant: 'info',
      })
    }
  }, [infos])

  const handleFilter = (search: string) => {
    let tmp: ServiceData[]
    if (search === '') {
      tmp = initServices
    } else {
      tmp = initServices.filter((service: ServiceData) => {
        const name = service.service_id
        return name.toLowerCase().includes(search.toLowerCase())
      })
    }
    setServices(tmp)
  }

  return (
    <Dashboard title="サービス変更/廃止手続き">
      <StyledCardRoot3>
        <CardContent>
          サービス変更手続き（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報を変更、IPアドレスの廃止をご希望の方もお選びください。）
          <br />
          サービス削除手続き（サービスに属している接続も廃止になりますのでご注意ください。）
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
      {services == null && <h3>現在、有効なサービスはありません。</h3>}
      {services !== null &&
        services.map((service: ServiceData, index) => (
          <StyledCardRoot3 key={'service_' + index}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {service.service_id}
              </Typography>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {service.id}
              </StyledTypographyTitle>
              &nbsp;
              <Pass key={'pass' + index} pass={service.pass} />
              <br />
            </CardContent>
            <CardActions>
              <ServiceListChangeDialog
                key={'service_list_change_dialog'}
                service={service}
              />
              <ServiceListDeleteDialog
                key={'service_list_delete_dialog'}
                service={service}
              />
            </CardActions>
          </StyledCardRoot3>
        ))}
    </Dashboard>
  )
}

function Pass(props: { pass: boolean }): any {
  const { pass } = props
  if (pass) {
    return <Chip size="small" color="primary" label="審査済み" />
  }
  return <Chip size="small" color="secondary" label="未審査" />
}
