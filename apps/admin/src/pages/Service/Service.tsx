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
import { GenServiceCode, GenServiceCodeOnlyService } from '../../components/Tool';
import { useServices } from '../../hooks/useResources';
import type { ServiceDetailData } from '../../interface';
import {
  StyledCard,
  StyledInputBase,
  StyledPaperRootInput,
  StyledTypographyTitle,
} from '../Dashboard/styles';

export default function Service() {
  const navigate = useNavigate();
  const { data: initServices, error } = useServices();
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  // 1:開通 2:未開通
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  const checkConnection = (service: ServiceDetailData) => {
    if (value === 1) {
      return service.pass;
    }
    if (value === 2) {
      return !service.pass;
    }
    return true;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  const services =
    search === ''
      ? (initServices ?? [])
      : (initServices ?? []).filter((service: ServiceDetailData) => {
          const code = GenServiceCodeOnlyService(service);
          return code.toLowerCase().includes(search.toLowerCase());
        });

  const handleFilter = (value: string) => {
    setSearch(value);
  };

  const clickGroupPage = (id: number) => navigate('/dashboard/group/' + id);
  const clickServicePage = (id: number) => navigate('/dashboard/service/' + id);

  return (
    <Dashboard title="Service List">
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
      {services
        .filter((service) => checkConnection(service))
        .map((service: ServiceDetailData) => (
          <StyledCard key={service.ID}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {service.ID}
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {GenServiceCodeOnlyService(service)}
              </Typography>
            </CardContent>
            <CardActions>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => clickServicePage(service.ID)}
                >
                  Detail
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={service.group_id === undefined}
                  onClick={() => clickGroupPage(service.group_id)}
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
