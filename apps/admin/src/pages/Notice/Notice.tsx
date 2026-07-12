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
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useNavigate } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import Dashboard from '../../components/Dashboard/Dashboard';
import { getStringFromDate } from '../../components/Tool';
import { useNotices } from '../../hooks/useResources';
import type { NoticeData } from '../../interface';
import { api } from '../../lib/api';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Notice() {
  const { data: initTickets, error } = useNotices();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(2);
  const now = new Date();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number((event.target as HTMLInputElement).value));
  };

  const toDate = (date: any): Date => {
    return new Date(date);
  };

  const deleteNoticeMutation = useMutation({
    mutationFn: (id: number) => api.delete('/notice/' + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notice'] });
      enqueueSnackbar('OK', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
  });

  const noticeDelete = (id: number) => {
    deleteNoticeMutation.mutate(id);
  };

  const tickets =
    search === ''
      ? (initTickets ?? [])
      : (initTickets ?? []).filter((notice: NoticeData) => {
          return notice.title.toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };

  const checkDate = (startTime: string, endTime: string | undefined) => {
    if (value === 1) {
      return toDate(startTime) > now;
    }
    if (value === 2) {
      return toDate(startTime) < now && now < toDate(endTime);
    }
    return now > toDate(endTime);
  };

  const clickAddPage = () => navigate('/dashboard/notice/add');
  const clickDetailPage = (id: number) => navigate('/dashboard/notice/' + id);

  return (
    <Dashboard title="Notice Info">
      <Button variant="contained" color="primary" onClick={() => clickAddPage()}>
        通知の追加
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
          <FormControlLabel value={2} control={<Radio color="primary" />} label="通知中" />
          <FormControlLabel value={1} control={<Radio color="primary" />} label="通知予定" />
          <FormControlLabel value={3} control={<Radio />} label="通知終了" />
        </RadioGroup>
      </FormControl>
      {tickets
        .filter((notice) => checkDate(notice.start_time, notice.end_time))
        .map((notice: NoticeData) => (
          <StyledCard key={'notice_id_' + notice.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {notice.ID} ({getStringFromDate(notice.start_time)} -{' '}
                {getStringFromDate(notice.end_time)})
              </StyledTypographyTitle>
              {notice.important && <Chip size="small" color="primary" label="重要" />}
              &nbsp;&nbsp;
              {notice.info && <Chip size="small" color="primary" label="情報" />}
              &nbsp;&nbsp;
              {notice.fault && <Chip size="small" color="secondary" label="障害" />}
              <br />
              <Typography variant="h5" component="h2">
                {notice.title}
              </Typography>
              <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]}>
                {notice.data}
              </ReactMarkdown>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                size="small"
                variant="outlined"
                onClick={() => clickDetailPage(notice.ID)}
              >
                Detail
              </Button>
              <Button
                color="secondary"
                size="small"
                variant="outlined"
                onClick={() => noticeDelete(notice.ID)}
              >
                Delete
              </Button>
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
