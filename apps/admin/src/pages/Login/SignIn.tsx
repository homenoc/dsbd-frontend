import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import React, { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { muiColorTheme } from '../../components/Theme';
import { login } from '../../lib/auth';
import { StyledAvatar, StyledLoginForm, SubmitButton } from '../../style';

export default function SignIn() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  // The old Login helper resolved with the error instead of rejecting, and the
  // form silently stayed put on failure — an empty onError keeps that.
  const loginMutation = useMutation({
    mutationFn: () => login(mail, password),
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: () => {},
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <ThemeProvider theme={muiColorTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <StyledLoginForm>
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="UserName"
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <SubmitButton type="submit" fullWidth variant="contained" color="primary">
                Sign In
              </SubmitButton>
            </form>
          </StyledLoginForm>
        </Box>
        {/*<Box mt={8}>*/}
        {/*    <Copyright/>*/}
        {/*</Box>*/}
      </Container>
    </ThemeProvider>
  );
}
