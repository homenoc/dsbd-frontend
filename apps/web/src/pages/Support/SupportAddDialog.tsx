import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DefaultSupportAddData } from '../../interface'
import { useSnackbar } from 'notistack'
import { Post } from '../../api/Support'
import { Get } from '../../api/Info'
import { StyledTextFieldVeryLong } from '../../style'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function SupportAddDialog(props: { groupEnable: boolean }) {
  const { groupEnable } = props
  const navigate = useNavigate()
  const [data, setData] = React.useState(DefaultSupportAddData)
  const [open, setOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const request = () => {
    if (data.title === '') {
      enqueueSnackbar('タイトルが入力されていません。', { variant: 'error' })
    }
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
    <Box>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        チケットの作成
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
              <h3>ユーザチャットとグループチャットの違い</h3>
              <div>
                ユーザチャット: ログインユーザと1対1のチャット
              </div>
              <div>
                グループチャット:
                ログインユーザのグループとのチャット（基本はこちらでお願いします）
              </div>
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="top"
                onChange={(event) => {
                  setData({ ...data, is_group: event.target.value === 'group' })
                }}
              >
                <FormControlLabel
                  value={'user'}
                  control={<Radio color="primary" />}
                  label="ユーザチャット"
                />
                <FormControlLabel
                  value={'group'}
                  control={<Radio color="primary" />}
                  disabled={!groupEnable}
                  label="グループチャット"
                />
              </RadioGroup>
              <br />
              <Typography variant="inherit">
                このチャットはMarkdownに準拠しております。
              </Typography>
              <br />
              <StyledTextFieldVeryLong
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
            <Grid item xs={12}>
              <h3>内容のプレビュー ↓</h3>
              <ReactMarkdown
                skipHtml={true}
                remarkPlugins={[remarkGfm]}
              >
                {data.data}
              </ReactMarkdown>
              内容のプレビュー ↑
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
    </Box>
  )
}
