import {
  AppBar,
  Box,
  Button,
  CardActions,
  CardContent,
  Chip,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import shaJS from 'sha.js';
import { Delete, Put } from '../../../../api/User';
import Dashboard from '../../../../components/Dashboard/Dashboard';
import { invalidateAllInfo, useGroup, useMe } from '../../../../hooks/useInfo';
import type { InfoData, UserData } from '../../../../interface';
import { queryClient } from '../../../../lib/queryClient';
import {
  StyledCardRoot3,
  StyledTextFieldMedium,
  StyledTextFieldShort,
  StyledTypographyTitle,
} from '../../../../style';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function UserDetail() {
  const theme = useTheme();
  const [loginUserID, setLoginUserID] = useState<number>();
  const [user, setUser] = useState<UserData>();
  const meQ = useMe();
  const groupQ = useGroup();
  const error = meQ.error ?? groupQ.error;
  const infoData = useMemo<InfoData | undefined>(() => {
    if (meQ.isLoading || groupQ.isLoading) return undefined;
    return {
      user: meQ.data,
      user_list: groupQ.userList,
    };
  }, [meQ.data, meQ.isLoading, groupQ.userList, groupQ.isLoading]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);
  const [email, setEmail] = React.useState({ email: '', email_verify: '' });
  const [password, setPassword] = React.useState({
    password: '',
    password_verify: '',
  });
  const [name, setName] = React.useState({ name: '', name_en: '' });
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    if (reload) {
      invalidateAllInfo(queryClient);
      setReload(false);
    }
  }, [reload]);

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData?.user_list != null) {
      const tmpUser = infoData.user_list.filter((user: UserData) => user.id === Number(id));
      setUser(tmpUser[0]);
      if (infoData.user != null) {
        setLoginUserID(infoData.user.id);
      }
    }
  }, [infoData, id]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const clickDeleteUser = () => {
    Delete(Number(id)).then((res) => {
      if (res.error === undefined) {
        enqueueSnackbar('OK', { variant: 'success' });
        invalidateAllInfo(queryClient);
        navigate('/dashboard/procedure/user');
      } else {
        enqueueSnackbar(res.error, { variant: 'error' });
      }
    });
  };

  const clickUpdateUser = () => {
    let data: any;

    if (value === 0) {
      // check e-mail
      if (email.email !== email.email_verify) {
        enqueueSnackbar('E-MailとE-Mail(確認用)が異なります。', {
          variant: 'error',
        });
        return;
      }
      if (!~email.email.indexOf('@')) {
        enqueueSnackbar('メールアドレスが正しくありません。', {
          variant: 'error',
        });
        return;
      }
      data = { email: email.email };
    } else if (value === 1) {
      // check password
      if (password.password !== password.password_verify) {
        enqueueSnackbar('PasswordとPassword(確認用)が異なります。', {
          variant: 'error',
        });
        return;
      }
      const passHash: string = shaJS('sha256').update(password.password).digest('hex');

      data = { pass: passHash };
    } else if (value === 2) {
      data = { name: name.name, name_en: name.name_en };
    } else {
      enqueueSnackbar('Tabのステータスが不正です。', { variant: 'error' });
      return;
    }

    Put(Number(id), data).then((res) => {
      if (res.error === undefined) {
        enqueueSnackbar('OK', { variant: 'success' });
        setReload(true);
      } else {
        enqueueSnackbar(res.error, { variant: 'error' });
      }
    });
  };

  return (
    <Dashboard title={'ユーザ情報 (ID: ' + id + ')'}>
      {id === undefined && <h2>IDの値が取得できません</h2>}
      {user == null && <h3>現在、有効なユーザはありません。</h3>}
      {user != null && (
        <StyledCardRoot3>
          <CardContent>
            <StyledTypographyTitle color="textSecondary" gutterBottom>
              ID: {user.id} ({user.email})
            </StyledTypographyTitle>
            <Typography variant="h5" component="h2">
              {user.name}({user.name_en})
            </Typography>
            <br />
            Level: {user.level}
            <br />
            <br />
            &nbsp;&nbsp;
            <MailVerify key={'mail_verify_' + id} mailVerify={user.mail_verify} />
            <br />
            <br />
            <br />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="メールアドレスの変更" {...a11yProps(0)} />
                <Tab label="パスワードの変更" {...a11yProps(1)} />
                <Tab label="ユーザ情報の変更" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <StyledTextFieldMedium
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="E-Mail Address"
                value={email.email}
                onChange={(event) => setEmail({ ...email, email: event.target.value })}
                autoFocus
              />
              <StyledTextFieldMedium
                name="email_verify"
                variant="outlined"
                required
                fullWidth
                id="email_verify"
                label="E-Mail Address(確認用)"
                value={email.email_verify}
                onChange={(event) => setEmail({ ...email, email_verify: event.target.value })}
                autoFocus
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <StyledTextFieldMedium
                name="password"
                variant="outlined"
                required
                fullWidth
                id="password"
                type={'password'}
                label="Password"
                value={password.password}
                onChange={(event) => setPassword({ ...password, password: event.target.value })}
                autoFocus
              />
              <StyledTextFieldMedium
                name="password_verify"
                variant="outlined"
                required
                fullWidth
                id="password_verify"
                type={'password'}
                label="Password(確認用)"
                value={password.password_verify}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    password_verify: event.target.value,
                  })
                }
                autoFocus
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <StyledTextFieldShort
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                value={name.name}
                onChange={(event) => setName({ ...name, name: event.target.value })}
                autoFocus
              />
              <StyledTextFieldShort
                name="name_en"
                variant="outlined"
                required
                fullWidth
                id="name_en"
                label="Name(English)"
                value={name.name_en}
                onChange={(event) => setName({ ...name, name_en: event.target.value })}
                autoFocus
              />
            </TabPanel>
          </CardContent>
          <CardActions>
            <Button size="small" variant="outlined" onClick={clickUpdateUser}>
              更新
            </Button>
            <Button
              size="small"
              variant="outlined"
              color={'secondary'}
              disabled={Number(id) === loginUserID}
              onClick={clickDeleteUser}
            >
              削除
            </Button>
          </CardActions>
        </StyledCardRoot3>
      )}
    </Dashboard>
  );
}

function MailVerify(props: { mailVerify: boolean }): any {
  const { mailVerify } = props;
  if (mailVerify) {
    return <Chip size="small" color="primary" label="メール確認済" />;
  }
  return <Chip size="small" color="secondary" label="メール未確認" />;
}
