import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { AgreeAntisocial } from '../api/User'
import { Logout } from '../api/Auth'
import { Get } from '../api/Info'
import Cookies from 'js-cookie'
import store from '../store'
import { clearInfos, clearTemplates } from '../store/action/Actions'

interface AntisocialAgreementDialogProps {
  open: boolean
}

export function AntisocialAgreementDialog(
  props: AntisocialAgreementDialogProps
) {
  const { open } = props
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const handleAgree = async () => {
    setLoading(true)
    const res = await AgreeAntisocial()
    if (res.error === undefined) {
      enqueueSnackbar('同意が完了しました。', { variant: 'success' })
      await Get()
    } else {
      enqueueSnackbar(res.error, { variant: 'error' })
    }
    setLoading(false)
  }

  const handleDisagree = () => {
    Logout().then(() => {
      Cookies.remove('user_token')
      Cookies.remove('access_token')
      store.dispatch(clearInfos())
      store.dispatch(clearTemplates())
      enqueueSnackbar('ログアウトしました。', { variant: 'info' })
      navigate('/login')
    })
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby="antisocial-dialog-title"
      PaperProps={{
        style: {
          backgroundColor: '#2b2a2a',
        },
      }}
    >
      <DialogTitle id="antisocial-dialog-title">
        反社会的勢力でないことの表明・確約
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" paragraph>
            私（または当グループ）は、次のとおり、反社会的勢力ではないことを表明し確約いたします。
          </Typography>
          <Typography variant="body2" paragraph>
            なお、次の1.の各号のいずれかに該当し、もしくは2.の各号のいずれかに該当する行為をし、または本表明・確約に関して虚偽の申告をしたことが判明した場合には、本サービスの利用が停止され、または利用の全部もしくは一部を解除されても異議を申しません。
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" paragraph>
            <strong>
              1. 本サービスの利用に際し、現在、次の各号のいずれにも該当しないことを表明し、かつ将来にわたっても該当しないことを確約いたします。
            </strong>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">（1）暴力団員</Typography>
            <Typography variant="body2">
              （2）暴力団員でなくなった時から5年を経過しない者
            </Typography>
            <Typography variant="body2">（3）暴力団準構成員</Typography>
            <Typography variant="body2">（4）暴力団関係企業</Typography>
            <Typography variant="body2">（5）総会屋</Typography>
            <Typography variant="body2">
              （6）社会運動等標ぼうゴロまたは特殊知能暴力集団等
            </Typography>
            <Typography variant="body2" paragraph>
              （7）その他前各号に準ずる者
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>
              2. 自らまたは第三者を利用して次の各号に該当する行為を行わないことを確約いたします。
            </strong>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              （1）反社会的勢力に対する資金提供など、反社会的勢力と密接な関係を持つ行為
            </Typography>
            <Typography variant="body2">（2）暴力的な要求行為</Typography>
            <Typography variant="body2">
              （3）法的責任を超えた不当な要求行為
            </Typography>
            <Typography variant="body2">
              （4）取引に関して脅迫的な言動をし、または暴力を用いる行為
            </Typography>
            <Typography variant="body2">
              （5）風説を流布し、偽計を用いまたは威力を用いて本サービス運営者の信用を毀損し、または業務を妨害する行為
            </Typography>
            <Typography variant="body2" paragraph>
              （6）その他前各号に準ずる行為
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            ※任意団体の場合、本確約に同意することにより、所属する全員が反社会的勢力と関わりがないことに同意したものとみなします。
          </Typography>
          <Typography variant="body2" color="warning.main">
            ※「同意しない」を選択した場合は、ログアウトされます。
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="secondary" disabled={loading}>
          同意しない
        </Button>
        <Button
          onClick={handleAgree}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          同意する
        </Button>
      </DialogActions>
    </Dialog>
  )
}
