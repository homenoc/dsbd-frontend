import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React from 'react';
import type { ServiceDetailData } from '../../../interface';
import { api } from '../../../lib/api';
import { StyledButton1 } from '../../../style';

export function ServiceAddAllowButton(props: { service: ServiceDetailData }) {
  const { service } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const putServiceMutation = useMutation({
    mutationFn: (req: ServiceDetailData) => api.put('/service/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  const changeLock = (add_allow: boolean) => {
    service.add_allow = add_allow;

    putServiceMutation.mutate(service);
  };

  if (service.add_allow) {
    return (
      <StyledButton1
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => changeLock(false)}
        color={'secondary'}
        variant="outlined"
      >
        追加を禁止
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
      接続追加を許可
    </StyledButton1>
  );
}
