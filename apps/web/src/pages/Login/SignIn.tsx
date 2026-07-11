import {
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Login } from '../../api/Auth'
import { useSnackbar } from 'notistack'
import { Get } from '../../api/Info'
import Cookies from 'js-cookie'
import store from '../../store'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import { muiColorTheme } from '../../components/Theme'
import {
  StyledAvatar,
  StyledButtonSubmit,
  StyledForm,
  StyledPaper,
} from './styles'

export default function SignIn() {
  const navigate = useNavigate()
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (mail === '') {
      enqueueSnackbar('メールアドレスが入力されていません。', {
        variant: 'error',
      })
      return
    }
    if (password === '') {
      enqueueSnackbar('パスワードが入力されていません。', { variant: 'error' })
      return
    }

    Cookies.remove('user_token')
    Cookies.remove('access_token')
    store.dispatch(clearInfos())
    store.dispatch(clearTemplates())

    Login(mail, password)
      .then((err) => {
        if (err === '') {
          enqueueSnackbar('Login Success !', { variant: 'info' })
          Get().then()
          navigate('/dashboard')
        } else {
          enqueueSnackbar(err, { variant: 'error' })
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          '何かしらのエラーが発生しました。 error: ' + error.response,
          { variant: 'error' }
        )
      })
  }

  return (
    <ThemeProvider theme={muiColorTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <StyledForm onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Mail"
              name="email"
              autoComplete="email"
              autoFocus
              defaultValue=""
              onChange={(event) => setMail(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              defaultValue=""
              onChange={(event) => setPassword(event.target.value)}
            />
            <StyledButtonSubmit
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign In
            </StyledButtonSubmit>
            <Grid container>
              <Grid item xs>
                <Link href="/forget" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </StyledForm>
        </StyledPaper>
        {/*<Box mt={8}>*/}
        {/*    <Copyright/>*/}
        {/*</Box>*/}
      </Container>
    </ThemeProvider>
  )
}
