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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import { Solved } from '../../components/Dashboard/Solved/Open';
import { useSupportTickets } from '../../hooks/useResources';
import type { TicketDetailData } from '../../interface';
import { api } from '../../lib/api';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Support() {
  const { data: initTickets, error } = useSupportTickets();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(false);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === 'true');
  };

  const tickets =
    search === ''
      ? (initTickets ?? [])
      : (initTickets ?? []).filter((grp: TicketDetailData) => {
          return grp.title.toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };

  const solvedMutation = useMutation({
    mutationFn: ({ id, solved }: { id: number; solved: boolean }) =>
      api.put('/support/' + id, { solved }),
    onSuccess: () => {
      enqueueSnackbar('OK', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['support'] });
    },
  });

  const clickSolvedStatus = (id: number, solved: boolean) => {
    solvedMutation.mutate({ id, solved });
  };
  const clickAddPage = () => navigate('/dashboard/support/add');
  const clickDetailPage = (id: number) => navigate('/dashboard/support/' + id);

  return (
    <Dashboard title="Ticket Info">
      <Button variant="contained" color="primary" onClick={() => clickAddPage()}>
        チケットの追加
      </Button>
      <br />
      <br />
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
          <FormControlLabel value={false} control={<Radio color="primary" />} label="未解決" />
          <FormControlLabel value={true} control={<Radio color="primary" />} label="解決済" />
        </RadioGroup>
      </FormControl>
      {tickets
        .filter((ticket) => ticket.solved === value)
        .map((ticket: TicketDetailData, index) => (
          <StyledCard key={'ticket_id_' + ticket.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {ticket.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {ticket.title}
              </Typography>
              <br />
              {(ticket.group_id === 0 || ticket.group_id == null) && (
                <Chip size="small" color="primary" label="個人チャット" />
              )}
              {!(ticket.group_id === 0 || ticket.group_id == null) && (
                <Chip size="small" color="primary" label="グループチャット" />
              )}
              &nbsp;&nbsp;
              <Solved key={index} solved={ticket.solved} />
              &nbsp;&nbsp;
              {ticket.admin && <Chip size="small" color="primary" label="管理者作成" />}
              <br />
              <br />
              {ticket.group_id != null && (
                <>
                  Group: {ticket.group?.org} ({ticket.group?.org_en})
                </>
              )}
              {ticket.group_id == null && <>Group: 割当なし</>}
              <br />
              作成者: {ticket.user?.name}
            </CardContent>
            <CardActions>
              <Button size="small" variant="outlined" onClick={() => clickDetailPage(ticket.ID)}>
                Detail
              </Button>
              {ticket.solved && (
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => clickSolvedStatus(ticket.ID, false)}
                >
                  未解決
                </Button>
              )}
              {!ticket.solved && (
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => clickSolvedStatus(ticket.ID, true)}
                >
                  解決済み
                </Button>
              )}
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
