import React, { useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DefaultSupportAddData, ServiceData } from '../../../interface'
import { useSnackbar } from 'notistack'
import { Get } from '../../../api/Info'
import { Post } from '../../../api/Request'
import { ServiceGet } from './Service'
import { StyledTextFieldVeryLong } from '../../../style'

export function ServiceListDeleteDialog(props: { service: ServiceData }) {
  const { service } = props
  const navigate = useNavigate()
  const [data, setData] = React.useState(DefaultSupportAddData)
  const [open, setOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const request = () => {
    if (data.data === '') {
      enqueueSnackbar('本文が入力されていません。', { variant: 'error' })
    }
    Post(data).then((res) => {
      if (res.error === undefined) {
        Get().then(() => {
          navigate('/dashboard/support/' + res.data.id)
        })
        setOpen(false)
      } else {
        enqueueSnackbar(res.error, { variant: 'error' })
      }
    })
  }

  useEffect(() => {
    setData({
      ...data,
      title: '[' + service.service_id + ' 廃止]サービス廃止手続き',
    })
  }, [])

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        サービス廃止手続き
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        fullScreen={true}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          style: {
            backgroundColor: '#2b2a2a',
          },
        }}
      >
        <DialogTitle id="customized-dialog-title">{data.title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <br />
              <StyledTextFieldVeryLong
                disabled={true}
                id="title"
                label="Title"
                multiline
                rows={1}
                value={data.title}
                onChange={(event) =>
                  setData({ ...data, title: event.target.value })
                }
                variant="outlined"
              />
              <br />
              <div>「{data.title}」の理由について詳しく説明してください。</div>
              <div>
                内容によりまして、承諾できない可能性がありますがご了承ください。
              </div>
              <br />
              <StyledTextFieldVeryLong
                id="data"
                label="内容"
                multiline
                rows={10}
                value={data.data}
                onChange={(event) =>
                  setData({ ...data, data: event.target.value })
                }
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <ServiceGet key={'serivce_get'} service={service} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
          <Button autoFocus onClick={request} color="primary">
            登録
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
