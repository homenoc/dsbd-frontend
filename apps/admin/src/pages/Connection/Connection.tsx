import {
  Button,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import { GenServiceCode } from '../../components/Tool';
import { useConnections } from '../../hooks/useResources';
import type { ConnectionDetailData } from '../../interface';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Connection() {
  const navigate = useNavigate();
  const { data: initConnections, error } = useConnections();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  // 1:開通 2:未開通
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const checkConnection = (connection: ConnectionDetailData) => {
    if (value === 1) {
      return connection.open;
    }
    if (value === 2) {
      return !connection.open;
    }
    return true;
  };

  const connections =
    search === ''
      ? (initConnections ?? [])
      : (initConnections ?? []).filter((connection: ConnectionDetailData) => {
          return GenServiceCode(connection).toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };
  const clickGroupPage = (id: number) => navigate('/dashboard/group/' + id);
  const clickServicePage = (id: number) => navigate('/dashboard/service/' + id);
  const clickConnectionPage = (id: number) => navigate('/dashboard/connection/' + id);

  return (
    <Dashboard title="Connection List">
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
        <RadioGroup row aria-label="gender" name="open" value={value} onChange={handleChange}>
          <FormControlLabel value={1} control={<Radio color="primary" />} label="開通" />
          <FormControlLabel value={2} control={<Radio color="secondary" />} label="未開通" />
        </RadioGroup>
      </FormControl>
      {connections
        .filter((connection) => checkConnection(connection))
        .map((connection: ConnectionDetailData) => (
          <StyledCard key={connection.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {connection.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {GenServiceCode(connection)}
              </Typography>
              <br />
              {/*Group: {service.gr?.org}({service.group?.org_en})*/}
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={1}>
                {connection.service !== undefined && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => clickConnectionPage(connection.ID)}
                  >
                    Detail
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  disabled={connection.service?.group_id === undefined}
                  onClick={() => clickServicePage(connection.service?.ID ?? 0)}
                >
                  Service
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={connection.service?.group_id === undefined}
                  onClick={() => clickGroupPage(connection.service?.group_id ?? 0)}
                >
                  Group
                </Button>
              </Stack>
            </CardActions>
          </StyledCard>
        ))}
    </Dashboard>
  );
}
