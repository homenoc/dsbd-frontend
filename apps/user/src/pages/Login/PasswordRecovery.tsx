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
import { muiColorTheme } from '../../components/Theme'
import {
  StyledPaper,
  StyledAvatar,
  StyledButtonSubmit,
  StyledForm,
} from './styles'

export default function PasswordRecovery() {
  const [mail, setMail] = useState('0123')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <ThemeProvider theme={muiColorTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper>
          <h3>現時点では、サーバ側が未対応のため使用できません。</h3>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Password Recovery
          </Typography>
          <StyledForm onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              defaultValue=""
              onChange={(event) => setMail(event.target.value)}
            />
            <StyledButtonSubmit
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Recovery
            </StyledButtonSubmit>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {'Already have an account? Sign in'}
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
