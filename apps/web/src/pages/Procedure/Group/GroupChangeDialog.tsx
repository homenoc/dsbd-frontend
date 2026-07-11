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
import { DefaultSupportAddData, GroupData } from '../../../interface'
import { useSnackbar } from 'notistack'
import { Get } from '../../../api/Info'
import { Post } from '../../../api/Request'
import { GroupGet } from '../../../components/Dashboard/Group/Group'
import { StyledTextFieldVeryLong } from '../../../style'

export function GroupChangeDialog(props: { group: GroupData }) {
  const { group } = props
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
      title: '[変更]グループ情報変更手続き',
      data:
        '例)\n---Group情報の変更---\n変更理由: \n\n' +
        '---変更前---\n\n---変更後---\n',
    })
  }, [])

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
        <DialogTitle id="connection_list_change_dialog">
          {data.title}
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
              <div>変更前、変更後のことも詳しく説明してください。</div>
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
              <GroupGet key={'group_get'} group={group} />
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
