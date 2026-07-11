import { isActive } from '@dsbd/shared';
import { Button, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardComponent from '../../components/Dashboard/Dashboard';
import { useConnections, useGroup, useMe, useServices } from '../../hooks/useInfo';
import type { ConnectionData, InfoData, ServiceData } from '../../interface';

function getSteps() {
  return [
    'グループ登録',
    '初期審査中',
    'サービス情報の登録',
    '審査中',
    '接続情報の登録',
    '開通作業中',
  ];
}

export default function Add() {
  const [data, setData] = React.useState<InfoData>();
  const meQ = useMe();
  const groupQ = useGroup();
  const serviceQ = useServices();
  const connectionsQ = useConnections();
  const error = meQ.error ?? groupQ.error ?? serviceQ.error ?? connectionsQ.error;
  const infoData = useMemo<InfoData | undefined>(() => {
    if (meQ.isLoading || groupQ.isLoading || serviceQ.isLoading || connectionsQ.isLoading)
      return undefined;
    return {
      user: meQ.data,
      group: groupQ.data,
      service: serviceQ.data,
      connection: connectionsQ.data,
    };
  }, [
    meQ.data,
    meQ.isLoading,
    groupQ.data,
    groupQ.isLoading,
    serviceQ.data,
    serviceQ.isLoading,
    connectionsQ.data,
    connectionsQ.isLoading,
  ]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData == null) return;
    if (infoData.user?.group_id !== 0 && !isActive(infoData.group?.expired_status)) {
      navigate('/dashboard');
    }
    setData(infoData);
    if (infoData.user?.group_id === 0) {
      setActiveStep(0);
    } else if (!infoData.group?.pass) {
      setActiveStep(1);
    } else if (infoData.group?.add_allow) {
      setActiveStep(2);
    } else if (
      infoData.service != null &&
      infoData.service?.filter((value: ServiceData) => !value.pass).length > 0
    ) {
      setActiveStep(3);
    } else if (
      infoData.service != null &&
      infoData.service?.filter((value: ServiceData) => value.add_allow).length > 0
    ) {
      setActiveStep(4);
    } else if (
      infoData.connection != null &&
      infoData.connection?.filter((value: ConnectionData) => !value.open).length > 0
    ) {
      setActiveStep(5);
    } else {
      setActiveStep(6);
    }
  }, [infoData, navigate]);

  return (
    <DashboardComponent title="申請手続き">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12}>
          {activeStep === 0 && data?.user != null && (
            <div>
              <div>
                アカウント登録後、以下の「グループ情報の申請」のボタンより申請を行ってください。
              </div>
              <br />
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/group')}
              >
                グループ情報の申請（初期申請）
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {(activeStep === 1 || activeStep === 3) && (
            <div>
              <div>現在、審査中を行っております。</div>
              <div>
                通常であれば、1週間以内に審査手続きが完了いたしますが、内容によって時間がかかる場合がございます。
              </div>
              <div>
                1ヶ月経っても審査中ステータスから変わらない場合は、サポートよりお問い合わせください。
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {activeStep === 2 && data?.group != null && (
            <div>
              <div>
                ネットワーク接続を希望の方は、「サービス情報の申請」申請ボタンより行ってください。
              </div>
              <br />
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/service')}
              >
                サービス情報の申請
              </Button>
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          {activeStep === 4 && data?.group != null && data?.service != null && (
            <div>
              <div>
                接続先の情報を登録する必要があるため、「接続情報の申請」ボタンより申請を行ってください。
              </div>
              <Button
                variant="contained"
                color={'primary'}
                onClick={() => navigate('/dashboard/add/connection')}
              >
                接続情報の申請
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </DashboardComponent>
  );
}
