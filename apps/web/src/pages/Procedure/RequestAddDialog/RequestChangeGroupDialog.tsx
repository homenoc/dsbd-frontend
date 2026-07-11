import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DefaultSupportAddData } from '../../../interface'
import { useSnackbar } from 'notistack'
import { Post } from '../../../api/Request'
import { Get } from '../../../api/Info'
import { StyledTextFieldVeryLong } from '../../../style'

export function RequestChangeGroupDialog() {
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
      } else {
        enqueueSnackbar(res.error, { variant: 'error' })
      }
    })
  }

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        次へ
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
        <DialogTitle id="customized-dialog-title">
          Support情報の追加
        </DialogTitle>
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
              <StyledTextFieldVeryLong
                id="data"
                label="内容"
                multiline
                rows={6}
                value={data.data}
                onChange={(event) =>
                  setData({ ...data, data: event.target.value })
                }
                variant="outlined"
              />
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
