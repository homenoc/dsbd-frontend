import { ExpiredStatus, expiredStatusLabels, isActive } from '@dsbd/shared';
import { Menu, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { type Dispatch, type SetStateAction } from 'react';
import type { GroupDetailData } from '../../../interface';
import { api } from '../../../lib/api';
import { StyledButton1 } from '../../../style';

export function GroupStatusButton(props: {
  data: GroupDetailData;
  autoMail: Dispatch<SetStateAction<string>>;
}) {
  const { data, autoMail } = props;
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const putGroupMutation = useMutation({
    mutationFn: (req: GroupDetailData) => api.put('/group/' + data.ID, req),
  });

  const changePassStatus = (pass: boolean) => {
    data.pass = pass;
    putGroupMutation.mutate(data, {
      onSettled: () => {
        if (pass) {
          autoMail('pass_the_examination');
        }

        handleClose();
        queryClient.invalidateQueries({ queryKey: ['group'] });
      },
    });
  };

  const changeAddAllowStatus = (add_allow: boolean) => {
    data.add_allow = add_allow;
    putGroupMutation.mutate(data, {
      onSettled: () => {
        handleClose();
        queryClient.invalidateQueries({ queryKey: ['group'] });
      },
    });
  };

  return (
    <div>
      {!data.pass && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changePassStatus(true)}
          color={'primary'}
          variant="contained"
        >
          審査OK
        </StyledButton1>
      )}
      {!data.add_allow && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changeAddAllowStatus(true)}
          color={'primary'}
          variant="contained"
        >
          サービス申請許可
        </StyledButton1>
      )}
      {data.add_allow && (
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={() => changeAddAllowStatus(false)}
          color={'secondary'}
          variant="outlined"
        >
          サービス新規申請を禁止
        </StyledButton1>
      )}
    </div>
  );
}

export function GroupLockButton(props: { data: GroupDetailData }) {
  const { data } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const putGroupMutation = useMutation({
    mutationFn: (req: GroupDetailData) => api.put('/group/' + data.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['group'] });
    },
  });

  const changeLock = (pass: boolean) => {
    data.pass = pass;

    putGroupMutation.mutate(data);
  };

  if (data.pass) {
    return (
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => changeLock(false)}
        color={'secondary'}
        variant="outlined"
      >
        変更を禁止
      </StyledButton1>
    );
  }
  return (
    <StyledButton1
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={() => changeLock(true)}
      color={'primary'}
      variant="outlined"
    >
      変更を許可
    </StyledButton1>
  );
}

export function GroupAbolition(props: { data: GroupDetailData }): any {
  const { data } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const putGroupMutation = useMutation({
    mutationFn: (req: GroupDetailData) => api.put('/group/' + data.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['group'] });
    },
  });

  const handleClickExpire = (expired_status: number) => {
    data.expired_status = expired_status;

    putGroupMutation.mutate(data);
    handleClose();
  };

  const clickActive = () => {
    data.expired_status = ExpiredStatus.None;

    putGroupMutation.mutate(data);
  };

  if (!isActive(data.expired_status)) {
    return (
      <div>
        <StyledButton1
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={clickActive}
          color={'primary'}
          variant="outlined"
        >
          Active処理
        </StyledButton1>
      </div>
    );
  }
  return (
    <div>
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color={'secondary'}
        variant="outlined"
      >
        廃止処理
      </StyledButton1>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClickExpire(ExpiredStatus.ReviewFailed)}>
          {expiredStatusLabels[ExpiredStatus.ReviewFailed]}
        </MenuItem>
        <MenuItem onClick={() => handleClickExpire(ExpiredStatus.ByMaster)}>
          {expiredStatusLabels[ExpiredStatus.ByMaster]}
        </MenuItem>
        <MenuItem onClick={() => handleClickExpire(ExpiredStatus.ByCommittee)}>
          {expiredStatusLabels[ExpiredStatus.ByCommittee]}
        </MenuItem>
      </Menu>
    </div>
  );
}
