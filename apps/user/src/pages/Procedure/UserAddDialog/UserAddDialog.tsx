import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { infoQueryKey } from '../../../hooks/useInfo';
import { DefaultUserAddData, type UserAddData } from '../../../interface';
import { api } from '../../../lib/api';
import { queryClient } from '../../../lib/queryClient';
import { StyledTextFieldShort, StyledTextFieldVeryLong } from '../../../style';

export function UserAddDialog(props: { groupID: number }) {
  const { groupID } = props;
  const navigate = useNavigate();
  const [data, setData] = React.useState(DefaultUserAddData);
  const [open, setOpen] = React.useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameEn, setFirstNameEn] = useState('');
  const [lastNameEn, setLastNameEn] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const userAddMutation = useMutation({
    mutationFn: (sendData: UserAddData) => api.post<void>(`/group/${groupID}/user`, sendData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoQueryKey }).then(() => {
        navigate('/dashboard/procedure');
      });
      enqueueSnackbar('ユーザ追加しました。', { variant: 'success' });
      setOpen(false);
    },
    onError: (e: Error) => {
      enqueueSnackbar(String(e.message), { variant: 'error' });
    },
  });

  const request = () => {
    if (firstName === '') {
      enqueueSnackbar('First Nameが入力されていません。', { variant: 'error' });
      return;
    }
    if (lastName === '') {
      enqueueSnackbar('Last Nameが入力されていません。', { variant: 'error' });
      return;
    }
    if (firstNameEn === '') {
      enqueueSnackbar('First Name(English)が入力されていません。', {
        variant: 'error',
      });
      return;
    }
    if (lastNameEn === '') {
      enqueueSnackbar('Last Name(English)が入力されていません。', {
        variant: 'error',
      });
      return;
    }
    if (!~data.email.indexOf('@')) {
      enqueueSnackbar('メールアドレスが正しくありません。', {
        variant: 'error',
      });
      return;
    }

    const sendData: UserAddData = {
      name: firstName + ' ' + lastName,
      name_en: firstNameEn + ' ' + lastNameEn,
      email: data.email,
      pass: '',
      level: data.level,
    };

    userAddMutation.mutate(sendData);
  };

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        次へ
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={'lg'}
      >
        <DialogTitle id="customized-dialog-title">ユーザ追加</DialogTitle>
        <DialogContent dividers>
          <div>このページにてグループにユーザを追加できます。</div>
          <div>
            本人確認メールと仮パスワードを追加ユーザのメールアドレス宛に送信されるので、登録後に確認をお願いします。
          </div>
          <br />
          <Grid item xs={12} sm={6}>
            <StyledTextFieldShort
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
            <StyledTextFieldShort
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
            <StyledTextFieldShort
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
            <StyledTextFieldShort
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
            <StyledTextFieldVeryLong
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={(event) => setData({ ...data, email: event.target.value })}
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <div>権限設定</div>
            <Select
              aria-label="gender"
              id="ipv4_subnet"
              value={data.level}
              variant="outlined"
              onChange={(event) => setData({ ...data, level: Number(event.target.value) })}
            >
              <MenuItem value={2}>追加・変更・閲覧権限(Master)</MenuItem>
              <MenuItem value={3}>閲覧権限のみ(User)</MenuItem>
              <MenuItem value={4}>通知のみ(Guest)</MenuItem>
            </Select>
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
    </div>
  );
}
