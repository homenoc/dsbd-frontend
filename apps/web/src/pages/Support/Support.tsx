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
import { Put } from '../../api/Support';
import Dashboard from '../../components/Dashboard/Dashboard';
import { Solved } from '../../components/Dashboard/Solved/Open';
import { infoQueryKey, useInfo } from '../../hooks/useInfo';
import type { TicketData } from '../../interface';
import { queryClient } from '../../lib/queryClient';
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../style';
import { SupportAddDialog } from './SupportAddDialog';

export default function Support() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [initTickets, setInitTickets] = useState<TicketData[]>([]);
  const [group, setGroupID] = useState(0);
  const { data: infoData, error } = useInfo();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(false);

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData == null) return;
    if (infoData.ticket != null) {
      setInitTickets(infoData.ticket);
      setTickets(infoData.ticket);
    }
    if (infoData.user != null) {
      setGroupID(infoData.user.group_id);
    }
  }, [infoData]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === 'true');
  };

  const handleFilter = (search: string) => {
    let tmp: TicketData[];
    if (search === '') {
      tmp = initTickets;
    } else {
      tmp = initTickets.filter((grp: TicketData) => {
        return grp.title.toLowerCase().includes(search.toLowerCase());
      });
    }
    setTickets(tmp);
  };

  const clickSolvedStatus = (id: number, solved: boolean) => {
    Put(id, { solved }).then((res) => {
      if (res.error === undefined) {
        enqueueSnackbar('OK', { variant: 'success' });
        queryClient.invalidateQueries({ queryKey: infoQueryKey });
      } else {
        enqueueSnackbar(res.error, { variant: 'error' });
      }
    });
  };

  const clickDetailPage = (id: number) => {
    navigate('/dashboard/support/' + id);
  };

  return (
    <Dashboard title="Ticket Info">
      <SupportAddDialog key={'support_add_dialog'} groupEnable={group !== 0} />
      <br />
      <StyledPaperRootInput>
        <StyledSearchInput
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
      {(tickets == null || tickets.length === 0) && <h3>現在、有効なチケットはありません。</h3>}
      {tickets !== null &&
        tickets
          .filter((ticket) => ticket.solved === value)
          .map((ticket: TicketData, index) => (
            <StyledCardRoot3 key={'ticket_' + index}>
              <CardContent>
                <StyledTypographyTitle color="textSecondary" gutterBottom>
                  ID: {ticket.id}
                </StyledTypographyTitle>
                <Typography variant="h5" component="h2">
                  {ticket.title}
                </Typography>
                <br />
                {ticket.group_id === 0 && (
                  <Chip size="small" color="primary" label="個人チャット" />
                )}
                {ticket.group_id !== 0 && (
                  <Chip size="small" color="primary" label="グループチャット" />
                )}
                &nbsp;&nbsp;
                <Solved key={index} solved={ticket.solved} />
                &nbsp;&nbsp;
                {ticket.admin && <Chip size="small" color="primary" label="管理者作成" />}
                <br />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => clickDetailPage(ticket.id)}>
                  Detail
                </Button>
                {ticket.solved && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => clickSolvedStatus(ticket.id, false)}
                  >
                    未解決
                  </Button>
                )}
                {!ticket.solved && (
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => clickSolvedStatus(ticket.id, true)}
                  >
                    解決済み
                  </Button>
                )}
              </CardActions>
            </StyledCardRoot3>
          ))}
    </Dashboard>
  );
}
