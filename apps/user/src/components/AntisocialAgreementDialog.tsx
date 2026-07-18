import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { infoQueryKey } from '../hooks/useInfo';
import { api } from '../lib/api';
import { Logout } from '../lib/auth';
import { queryClient } from '../lib/queryClient';

interface AntisocialAgreementDialogProps {
  open: boolean;
}

export function AntisocialAgreementDialog(props: AntisocialAgreementDialogProps) {
  const { open } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const agreeMutation = useMutation({
    mutationFn: () => api.put<void>('/user/antisocial/agree'),
    onSuccess: async () => {
      enqueueSnackbar('同意が完了しました。', { variant: 'success' });
      await queryClient.invalidateQueries({ queryKey: infoQueryKey });
    },
    onError: (e: Error) => {
      enqueueSnackbar(String(e.message), { variant: 'error' });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleAgree = () => {
    setLoading(true);
    agreeMutation.mutate();
  };

  const logoutMutation = useMutation({
    mutationFn: () => Logout(),
    onSettled: () => {
      Cookies.remove('user_token');
      Cookies.remove('access_token');
      queryClient.clear();
      enqueueSnackbar('ログアウトしました。', { variant: 'info' });
      navigate('/login');
    },
  });

  const handleDisagree = () => {
    logoutMutation.mutate();
  };

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
      <DialogTitle id="antisocial-dialog-title">反社会的勢力でないことの表明・確約</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" paragraph>
            昨今の社会情勢を踏まえ、入会いただく皆さまに反社会的勢力の排除に関する誓約を行っていただいております。下記の内容をご確認いただき、同意をいただきますようお願いいたします。
          </Typography>
          <Typography variant="body2" paragraph>
            In light of recent social conditions, we are requesting all members to sign a pledge
            regarding the exclusion of antisocial forces. Please review the following content and
            provide your agreement.
          </Typography>
          <Typography variant="body2" paragraph>
            なお、誓約いただけない場合は、会員資格を停止されていただくこともございます。あらかじめご了承ください。
          </Typography>
          <Typography variant="body2" paragraph>
            If you are unable to make this agreement, your membership may be suspended.
          </Typography>
          <Typography variant="body2" paragraph>
            私(法人の場合は当該法人及びその役員・実質的支配者、任意団体の場合は当該団体の構成員全員)は、以下の通り、現在及び将来にわたって、反社会的勢力ではないことを表明し確約いたします。
          </Typography>
          <Typography variant="body2" paragraph>
            I(in the case of a corporation, the corporation and its officers and beneficial owners;
            in the case of a private organization, all members of the organization) hereby declare
            and affirm that I am not, and will not be, an anti-social force.
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" paragraph>
            <strong>1.反社会的勢力への不該当 (Non-Affiliation with Anti-Social Forces)</strong>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">(1) 暴力団員</Typography>
            <Typography variant="body2">(2) 暴力団員でなくなった時から5年を経過しない者</Typography>
            <Typography variant="body2">(3) 暴力団準構成員</Typography>
            <Typography variant="body2">(4) 暴力団関係企業</Typography>
            <Typography variant="body2">(5) 総会屋</Typography>
            <Typography variant="body2">(6) 社会運動等標ぼうゴロまたは特殊知能暴力集団</Typography>
            <Typography variant="body2" paragraph>
              (7) その他これらに準ずる者
            </Typography>
          </Box>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">(1) Organized crime group members</Typography>
            <Typography variant="body2">
              (2) Persons who ceased to be organized crime group members less than five years prior
            </Typography>
            <Typography variant="body2">(3) Associate members of organized crime groups</Typography>
            <Typography variant="body2">
              (4) Companies associated with organized crime groups
            </Typography>
            <Typography variant="body2">(5) Shareholder agitators</Typography>
            <Typography variant="body2">
              (6) Individuals posing as social activists or special intelligence-based violent
              groups
            </Typography>
            <Typography variant="body2" paragraph>
              (7) Other persons equivalent to the above
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>2.不適切行為の禁止 (Prohibited Conduct as a Counterparty)</strong>
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              (1) 反社会的勢力に対する資金提供など、反社会的勢力と密接な関係を持つ行為
            </Typography>
            <Typography variant="body2">(2) 暴力的な要求行為</Typography>
            <Typography variant="body2">(3) 法的義務を超えた不当な要求行為</Typography>
            <Typography variant="body2">
              (4) 取引等に関連して脅迫的な言動または暴力を用いる行為
            </Typography>
            <Typography variant="body2">
              (5) 偽計や威力を用いて本会の信用を毀損し、又は本会の業務を妨害する行為
            </Typography>
            <Typography variant="body2" paragraph>
              (6) その他前各号に準ずる行為
            </Typography>
          </Box>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              (1) Acts involving close ties to antisocial forces, such as providing them with funds
            </Typography>
            <Typography variant="body2">(2) Violent demands</Typography>
            <Typography variant="body2">(3) Unjust demands exceeding legal obligations</Typography>
            <Typography variant="body2">
              (4) Acts involving threatening words or actions, or the use of violence, in connection
              with transactions or similar matters
            </Typography>
            <Typography variant="body2">
              (5) Acts that damage the reputation of this association or interfere with its business
              operations through fraud or coercion
            </Typography>
            <Typography variant="body2" paragraph>
              (6) Other acts equivalent to the foregoing items
            </Typography>
          </Box>
          <Typography variant="body2" paragraph>
            <strong>3.除名 (Termination)</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            万一、私が前各条に違反し、又は反社会的勢力に該当することが判明した場合、貴組織は私に対して何らの催告を要することなく、会員資格を直ちに停止・解除できるものとします。
          </Typography>
          <Typography variant="body2" paragraph>
            In the event of a violation of any of the preceding articles or if it is determined that
            the member is an anti-social force, membership may be suspended or terminated
            immediately without any prior notice.
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="warning.main">
            ※「同意しない」を選択した場合は、ログアウトされます。
          </Typography>
          <Typography variant="body2" color="warning.main">
            If you select &quot;Disagree&quot;, you will be logged out.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="secondary" disabled={loading}>
          同意しない
        </Button>
        <Button onClick={handleAgree} color="primary" variant="contained" disabled={loading}>
          同意する
        </Button>
      </DialogActions>
    </Dialog>
  );
}
