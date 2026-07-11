import {
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import React, { FormEvent, useState } from 'react'
import { muiColorTheme } from '../../components/Theme'
import { DefaultUserAddData, UserAddData } from '../../interface'
import { useSnackbar } from 'notistack'
import { restfulApiConfig } from '../../api/Config'
import { Post } from '../../api/User'
import { useNavigate } from 'react-router-dom'
import shaJS from 'sha.js'
import {
  StyledAvatar,
  StyledButtonSubmit,
  StyledForm,
  StyledPaper,
} from './styles'

export default function SignUp() {
  const [data, setData] = useState(DefaultUserAddData)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [firstNameEn, setFirstNameEn] = useState('')
  const [lastNameEn, setLastNameEn] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [agree, setAgree] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  let hCaptchaSiteKey = ''

  if (restfulApiConfig.hCaptchaSiteKey != null) {
    hCaptchaSiteKey = restfulApiConfig.hCaptchaSiteKey
  }

  const request = (e: FormEvent) => {
    if (!agree) {
      enqueueSnackbar('利用規約に同意されていません。', { variant: 'error' })
      return
    }
    if (data.pass !== passwordAgain) {
      enqueueSnackbar('パスワードが一致しません。', { variant: 'error' })
      return
    }
    if (firstName === '') {
      enqueueSnackbar('First Nameが入力されていません。', { variant: 'error' })
      return
    }
    if (lastName === '') {
      enqueueSnackbar('Last Nameが入力されていません。', { variant: 'error' })
      return
    }
    if (firstNameEn === '') {
      enqueueSnackbar('First Name(English)が入力されていません。', {
        variant: 'error',
      })
      return
    }
    if (lastNameEn === '') {
      enqueueSnackbar('Last Name(English)が入力されていません。', {
        variant: 'error',
      })
      return
    }
    if (!~data.email.indexOf('@')) {
      enqueueSnackbar('メールアドレスが正しくありません。', {
        variant: 'error',
      })
      return
    }

    const passHash: string = shaJS('sha256').update(data.pass).digest('hex')

    const sendData: UserAddData = {
      name: firstName + ' ' + lastName,
      name_en: firstNameEn + ' ' + lastNameEn,
      email: data.email,
      pass: passHash,
      level: 0,
    }

    Post(sendData).then((res) => {
      if (res.error === undefined) {
        enqueueSnackbar('OK', { variant: 'success' })
        navigate('/login')
      } else {
        enqueueSnackbar(res.error, { variant: 'error' })
      }
    })
    e.preventDefault()
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
            Sign up
          </Typography>
          <StyledForm onSubmit={request} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstNameJP"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstNameJP"
                  label="First Name(Japanese)"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastNameJP"
                  label="Last Name(Japanese)"
                  name="lastNameJP"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstNameEn"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstNameEn"
                  label="First Name(English)"
                  value={firstNameEn}
                  onChange={(event) => setFirstNameEn(event.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastNameEn"
                  label="Last Name(English)"
                  name="lastNameEn"
                  value={lastNameEn}
                  onChange={(event) => setLastNameEn(event.target.value)}
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={data.email}
                  onChange={(event) =>
                    setData({ ...data, email: event.target.value })
                  }
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={data.pass}
                  onChange={(event) =>
                    setData({ ...data, pass: event.target.value })
                  }
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password_again"
                  label="Password again"
                  type="password"
                  id="password_again"
                  value={passwordAgain}
                  onChange={(event) => setPasswordAgain(event.target.value)}
                  autoComplete="current-password-again"
                />
              </Grid>
              <Grid container justifyContent="flex-start">
                <Grid item>
                  <Link href="https://www.homenoc.ad.jp/about/rules/" variant="body2">
                    会則：https://www.homenoc.ad.jp/about/rules/
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="https://www.homenoc.ad.jp/about/privacy/"
                    variant="body2"
                  >
                    Privacy Policy：https://www.homenoc.ad.jp/about/privacy/
                  </Link>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div>
                  ご利用にあたっては当団体のプライバシーポリシーと会則に同意いただく必要がございます。
                </div>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={agree}
                      onChange={() => setAgree(!agree)}
                      color="primary"
                    />
                  }
                  label="利用規約に同意しますか？"
                />
              </Grid>
              {/*<Grid item xs={12}>*/}
              {/*    <div>hCaptchaの機能はテスト中</div>*/}
              {/*    <HCaptcha*/}
              {/*        sitekey={hCaptchaSiteKey}*/}
              {/*        onVerify={(token) => handleVerificationSuccess(token)}*/}
              {/*    />*/}
              {/*</Grid>*/}
            </Grid>
            <StyledButtonSubmit
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign Up
            </StyledButtonSubmit>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </StyledForm>
        </StyledPaper>
      </Container>
    </ThemeProvider>
  )
}
