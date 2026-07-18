import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import type { SupportAddData } from '../interface';
import { api } from '../lib/api';
import { queryClient } from '../lib/queryClient';
import { infoQueryKey } from './useInfo';

/**
 * Shared "submit a procedure request" mutation (POST /request), used by the
 * procedure dialogs: on success it refreshes the info payload and navigates
 * to the created support ticket. `onSuccess` lets a dialog add its own side
 * effect (e.g. closing itself) without duplicating the flow.
 */
export function useRequestMutation(options?: { onSuccess?: () => void }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (sendData: SupportAddData) => api.post<any>('/request', sendData),
    onSuccess: (resData: any) => {
      queryClient.invalidateQueries({ queryKey: infoQueryKey }).then(() => {
        navigate(`/dashboard/support/${resData.id}`);
      });
      options?.onSuccess?.();
    },
    onError: (e: Error) => {
      enqueueSnackbar(String(e.message), { variant: 'error' });
    },
  });
}
