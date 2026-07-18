import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { muiColorTheme } from '../../components/Theme';
import { infoQueryKey } from '../../hooks/useInfo';
import { Login } from '../../lib/auth';
import { queryClient } from '../../lib/queryClient';
import { StyledAvatar, StyledButtonSubmit, StyledForm, StyledPaper } from './styles';

export default function SignIn() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mail === '') {
      enqueueSnackbar('メールアドレスが入力されていません。', {
        variant: 'error',
      });
      return;
    }
    if (password === '') {
      enqueueSnackbar('パスワードが入力されていません。', { variant: 'error' });
      return;
    }

    Cookies.remove('user_token');
    Cookies.remove('access_token');
    queryClient.clear();

    try {
      await Login(mail, password);
      enqueueSnackbar('Login Success !', { variant: 'info' });
      queryClient.invalidateQueries({ queryKey: infoQueryKey });
      navigate('/dashboard');
    } catch (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  };

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
            <StyledButtonSubmit type="submit" fullWidth variant="contained" color="primary">
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
  );
}
