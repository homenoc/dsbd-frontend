import { isActive } from '@dsbd/shared';
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAll } from '../../api/User';
import Dashboard from '../../components/Dashboard/Dashboard';
import type { UserDetailData } from '../../interface';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function User() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDetailData[]>([]);
  const [initUsers, setInitUsers] = useState<UserDetailData[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  // 1:有効 2:無効
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    GetAll().then((res) => {
      if (res.error === '') {
        setUsers(res.data);
        setInitUsers(res.data);
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' });
      }
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const checkUser = (user: UserDetailData) => {
    if (value === 1) {
      return isActive(user.expired_status);
    }
    if (value === 2) {
      return !isActive(user.expired_status);
    }
    return true;
  };

  const handleFilter = (search: string) => {
    let tmp: UserDetailData[];
    if (search === '') {
      tmp = initUsers;
    } else {
      tmp = initUsers.filter((users: UserDetailData) => {
        const name = users.name + users.name_en;
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }
    setUsers(tmp);
  };

  return (
    <Dashboard title="User Info">
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
          <FormControlLabel value={1} control={<Radio color="primary" />} label="有効" />
          <FormControlLabel value={2} control={<Radio color="secondary" />} label="無効" />
        </RadioGroup>
      </FormControl>
      {users
        .filter((user) => checkUser(user))
        .map((user: UserDetailData) => (
          <StyledCard key={'user_' + user.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {user.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {user.name} ({user.name_en})
              </Typography>
              <br />
              <Chip
                size="small"
                label={isActive(user.expired_status) ? '有効' : '無効'}
                color={isActive(user.expired_status) ? 'success' : 'error'}
                sx={{ mr: 1 }}
              />
              <Chip
                size="small"
                label={user.antisocial_check === true ? '反社チェック済' : '反社未チェック'}
                color={user.antisocial_check === true ? 'success' : 'warning'}
                sx={{ mr: 1 }}
              />
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate('/dashboard/user/' + user.ID)}
              >
                Detail
              </Button>
              {/*<Button size="small" onClick={() => clickDetailPage(notice.ID)}>Detail</Button>*/}
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
