import {
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import { useTokens } from '../../hooks/useResources';
import type { TokenDetailData } from '../../interface';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Token() {
  const { data: initTokens, error } = useTokens();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  // 1:有効 2:無効
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const checkToken = (token: TokenDetailData) => {
    if (value === 1) {
      return token.admin;
    }
    if (value === 2) {
      return !token.admin;
    }
    return true;
  };

  const tokens =
    search === ''
      ? (initTokens ?? [])
      : (initTokens ?? []).filter((token: TokenDetailData) => {
          const tmpToken = token.access_token + token.user_token + token.tmp_token;
          return tmpToken.toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };

  return (
    <Dashboard title="Token Info">
      <StyledPaperRootInput>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value);
          }}
        />
      </StyledPaperRootInput>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
          <FormControlLabel value={1} control={<Radio color="primary" />} label="管理側" />
          <FormControlLabel value={2} control={<Radio color="secondary" />} label="ユーザ側" />
        </RadioGroup>
      </FormControl>
      {tokens
        .filter((token) => checkToken(token))
        .map((token: TokenDetailData) => (
          <StyledCard key={'token_' + token.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {token.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                AccessToken: {token.access_token}
                <br />
                UserToken: {token.user_token}
                <br />
                TmpToken: {token.tmp_token}
              </Typography>
              <br />
            </CardContent>
            <CardActions>
              {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
