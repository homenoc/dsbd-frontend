import { CardActions, CardContent, Chip, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../../components/Dashboard/Dashboard';
import { useServices } from '../../../hooks/useInfo';
import type { InfoData, ServiceData } from '../../../interface';
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../../style';
import { ServiceListChangeDialog } from './ServiceListChangeDialog';
import { ServiceListDeleteDialog } from './ServiceListDeleteDialog';

export default function ServiceList() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [initServices, setInitServices] = useState<ServiceData[]>([]);
  const serviceQ = useServices();
  const error = serviceQ.error;
  const infoData = useMemo<InfoData | undefined>(() => {
    if (serviceQ.isLoading) return undefined;
    return {
      service: serviceQ.data,
    };
  }, [serviceQ.data, serviceQ.isLoading]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData?.service != null) {
      setInitServices(infoData.service);
      setServices(infoData.service);
    }
  }, [infoData]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleFilter = (search: string) => {
    let tmp: ServiceData[];
    if (search === '') {
      tmp = initServices;
    } else {
      tmp = initServices.filter((service: ServiceData) => {
        const name = service.service_id;
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }
    setServices(tmp);
  };

  return (
    <Dashboard title="サービス変更/廃止手続き">
      <StyledCardRoot3>
        <CardContent>
          サービス変更手続き（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報を変更、IPアドレスの廃止をご希望の方もお選びください。）
          <br />
          サービス削除手続き（サービスに属している接続も廃止になりますのでご注意ください。）
        </CardContent>
      </StyledCardRoot3>
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
      {services == null && <h3>現在、有効なサービスはありません。</h3>}
      {services !== null &&
        services.map((service: ServiceData, index) => (
          <StyledCardRoot3 key={'service_' + index}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {service.service_id}
              </Typography>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {service.id}
              </StyledTypographyTitle>
              &nbsp;
              <Pass key={'pass' + index} pass={service.pass} />
              <br />
            </CardContent>
            <CardActions>
              <ServiceListChangeDialog key={'service_list_change_dialog'} service={service} />
              <ServiceListDeleteDialog key={'service_list_delete_dialog'} service={service} />
            </CardActions>
          </StyledCardRoot3>
        ))}
    </Dashboard>
  );
}

function Pass(props: { pass: boolean }): any {
  const { pass } = props;
  if (pass) {
    return <Chip size="small" color="primary" label="審査済み" />;
  }
  return <Chip size="small" color="secondary" label="未審査" />;
}
