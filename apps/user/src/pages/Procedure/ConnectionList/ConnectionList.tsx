import { CardActions, CardContent, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../../../components/Dashboard/Dashboard';
import { useInfo } from '../../../hooks/useInfo';
import type { InfosData } from '../../../interface';
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../../style';
import { ConnectionListChangeDialog } from './ConnectionListChangeDialog';
import { ConnectionListDeleteDialog } from './ConnectionListDeleteDialog';

export default function ConnectionList() {
  const [infos, setInfos] = useState<InfosData[]>([]);
  const [initInfos, setInitInfos] = useState<InfosData[]>([]);
  const { data: infoData, error } = useInfo();
  const { enqueueSnackbar } = useSnackbar();

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData?.info != null) {
      setInitInfos(infoData.info);
      setInfos(infoData.info);
    }
  }, [infoData]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const handleFilter = (search: string) => {
    let tmp: InfosData[];
    if (search === '') {
      tmp = initInfos;
    } else {
      tmp = initInfos.filter((tmpInfo: InfosData) => {
        const serviceId = tmpInfo.service_id;
        return serviceId.toLowerCase().includes(search.toLowerCase());
      });
    }
    setInfos(tmp);
  };

  return (
    <Dashboard title="接続変更/廃止手続き">
      <StyledCardRoot3>
        <CardContent>
          接続変更手続き（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報を変更、IPアドレスの廃止をご希望の方もお選びください。）
          <br />
          接続削除手続き（サービスに属している接続も廃止になりますのでご注意ください。）
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
      {infos == null && <h3>現在、有効なサービスはありません。</h3>}
      {infos != null &&
        infos.map((tmpInfo: InfosData, index) => (
          <StyledCardRoot3 key={'info_' + index}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {tmpInfo.service_id}
              </Typography>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                {/*ID: {tmpInfo.id}*/}
              </StyledTypographyTitle>
              &nbsp;
              {/*<Pass key={"pass" + index} pass={connection.open}/>*/}
              <br />
            </CardContent>
            <CardActions>
              <ConnectionListChangeDialog key={'connection_list_change_dialog'} info={tmpInfo} />
              <ConnectionListDeleteDialog key={'connection_list_delete_dialog'} info={tmpInfo} />
            </CardActions>
          </StyledCardRoot3>
        ))}
    </Dashboard>
  );
}
