import React, { useEffect } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import { Button, Grid, Step, StepLabel, Stepper } from '@mui/material'
import {
  clearInfos,
  clearTemplates,
  renewInfos,
} from '../../store/action/Actions'
import store, { RootState } from '../../store'
import { DefaultTemplateData, InfoData, TemplateData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { Get, GetTemplate } from '../../api/Info'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

function getSteps() {
  return [
    'グループ登録',
    '初期審査中',
    'サービス情報の登録',
    '審査中',
    '接続情報の登録',
    '開通作業中',
  ]
}

export default function Add() {
  const [data, setData] = React.useState<InfoData>()
  const [template, setTemplate] =
    React.useState<TemplateData>(DefaultTemplateData)
  const infos = useSelector((state: RootState) => state.infos)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()

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
    Get().then()
  }, [])

  useEffect(() => {
    // info
    const tmpData = infos[infos.length - 1]

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
        if (
          tmpData.data.user?.group_id !== 0 &&
          tmpData.data?.group?.expired_status !== 0
        ) {
          navigate('/dashboard')
        }
        setData(tmpData.data)
        // add group
        if (tmpData.data.user?.group_id === 0) {
          setActiveStep(0)
        } else if (!tmpData.data.group?.pass) {
          setActiveStep(1)
        } else if (tmpData.data.group?.add_allow) {
          setActiveStep(2)
        } else if (
          tmpData.data.service != null &&
          tmpData.data.service?.filter((value) => !value.pass).length > 0
        ) {
          setActiveStep(3)
        } else if (
          tmpData.data.service != null &&
          tmpData.data.service?.filter((value) => value.add_allow).length > 0
        ) {
          setActiveStep(4)
        } else if (
          tmpData.data.connection != null &&
          tmpData.data.connection?.filter((value) => !value.open).length > 0
        ) {
          setActiveStep(5)
        } else {
          setActiveStep(6)
        }
      } else {
        Get().then()
        const date = new Date()
        enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
          variant: 'info',
        })
      }
    }
  }, [infos])

  return (
    <DashboardComponent title="申請手続き">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12}>
          {activeStep === 0 && data?.user != null && (
            <div>
              <div>
                アカウント登録後、以下の「グループ情報の申請」のボタンより申請を行ってください。
              </div>
              <br />
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/group')}
              >
                グループ情報の申請（初期申請）
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {(activeStep === 1 || activeStep === 3) && (
            <div>
              <div>現在、審査中を行っております。</div>
              <div>
                通常であれば、1週間以内に審査手続きが完了いたしますが、内容によって時間がかかる場合がございます。
              </div>
              <div>
                1ヶ月経っても審査中ステータスから変わらない場合は、サポートよりお問い合わせください。
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {activeStep === 2 && data?.group != null && (
            <div>
              <div>
                ネットワーク接続を希望の方は、「サービス情報の申請」申請ボタンより行ってください。
              </div>
              <br />
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/service')}
              >
                サービス情報の申請
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {activeStep === 4 && data?.group != null && data?.service != null && (
            <div>
              <div>
                接続先の情報を登録する必要があるため、「接続情報の申請」ボタンより申請を行ってください。
              </div>
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/connection')}
              >
                接続情報の申請
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </DashboardComponent>
  )
}
