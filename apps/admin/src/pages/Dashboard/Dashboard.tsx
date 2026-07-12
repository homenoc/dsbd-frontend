import {
  ExpiredStatus,
  MemberType,
  canManageServices,
  expiredStatusLabels,
  isActive,
} from '@dsbd/shared';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Connection from '../../components/Dashboard/Connection/Connection';
import DashboardComponent from '../../components/Dashboard/Dashboard';
import { Group } from '../../components/Dashboard/Group/Group';
import { MemoGroup } from '../../components/Dashboard/Group/Memo';
import Request from '../../components/Dashboard/Request/Request';
import Service from '../../components/Dashboard/Service/Service';
import Ticket from '../../components/Dashboard/Ticket/Ticket';
import { useCatalog } from '../../hooks/useCatalog';
import {
  useConnections,
  useGroups,
  useServices,
  useSupportTickets,
} from '../../hooks/useResources';
import type {
  ConnectionDetailData,
  GroupDetailData,
  ServiceDetailData,
  TicketDetailData,
} from '../../interface';

export default function Dashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: template } = useCatalog();
  // The group list comes from the shared useGroups hook (['group']) instead of
  // a page-local GroupGetAll query (TECH-DEBT #9).
  const { data: groups, error: groupsError } = useGroups();
  const { data: supportData, error: supportError, isLoading: supportLoading } = useSupportTickets();
  const { data: service, error: serviceError, isLoading: serviceLoading } = useServices();
  const {
    data: connection,
    error: connectionError,
    isLoading: connectionLoading,
  } = useConnections();

  const ticket = supportData?.filter((item: TicketDetailData) => !item.request);
  const request = supportData?.filter((item: TicketDetailData) => item.request);
  const group: GroupDetailData[] | undefined = groups;

  useEffect(() => {
    for (const err of [groupsError, supportError, serviceError, connectionError]) {
      if (err) {
        enqueueSnackbar(String((err as Error).message), { variant: 'error' });
      }
    }
  }, [groupsError, supportError, serviceError, connectionError]);

  // The old reload flag flipped false once the first fetch resolved; the
  // summary card stays hidden until then.
  const reload = supportLoading && serviceLoading && connectionLoading;

  const [expired_status0IsChecked, setExpired_status0IsChecked] = useState(true);
  const [expired_status1IsChecked, setExpired_status1IsChecked] = useState(false);
  const [expired_status2IsChecked, setExpired_status2IsChecked] = useState(false);
  const [expired_status3IsChecked, setExpired_status3IsChecked] = useState(false);
  const [member_type90IsChecked, setMember_type90IsChecked] = useState(false);
  const [member_type99IsChecked, setMember_type99IsChecked] = useState(false);
  const [hasEnabledServiceIsChecked, setHasEnabledServiceIsChecked] = useState(true);
  const [hasEnabledConnectionIsChecked, setHasEnabledConnectionIsChecked] = useState(true);
  const [groupDialogIsOpen, setGroupDialogIsOpen] = useState(false);

  return (
    <DashboardComponent title="Dashboard">
      <Grid container spacing={3}>
        {!reload && (
          <Grid item xs={12}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Chip
                    color="primary"
                    style={{
                      paddingTop: 1,
                    }}
                    label={`有効GROUP: ${
                      group?.filter((g: GroupDetailData) => isActive(g.expired_status)).length
                    }`}
                  />
                  <Chip
                    color="primary"
                    label={`有効SERVICE: ${service?.filter((s) => s.enable && s.pass).length}`}
                  />
                  <Chip
                    color="primary"
                    label={`有効CONNECTION: ${
                      connection?.filter((d) => d.enable && d.open).length
                    }`}
                  />
                  <Chip
                    color={
                      // 数によって色を変える
                      ticket?.filter((item: TicketDetailData) => !item.solved).length !== 0
                        ? 'error'
                        : 'success'
                    }
                    label={`未対処チケット数: ${
                      ticket?.filter((item: TicketDetailData) => !item.solved).length
                    }`}
                  />
                  <Chip
                    color={
                      // 数によって色を変える
                      request?.filter(
                        (item: TicketDetailData) => !item.solved && !item.request_reject,
                      ).length !== 0
                        ? 'error'
                        : 'success'
                    }
                    label={`未対処リクエスト数: ${
                      request?.filter(
                        (item: TicketDetailData) => !item.solved && !item.request_reject,
                      ).length
                    }`}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          <Ticket key={'ticket'} data={ticket?.filter((item: TicketDetailData) => !item.solved)} />
        </Grid>
        <Grid item xs={12}>
          <Request
            key={'request'}
            data={request?.filter((item: TicketDetailData) => !item.solved)}
          />
        </Grid>
        <Grid item xs={12}>
          <Service
            key={'service'}
            data={service?.filter((item: ServiceDetailData) => item.enable && !item.pass)}
            template={template}
          />
        </Grid>
        <Grid item xs={12}>
          <Connection
            key={'connection'}
            data={connection?.filter((item: ConnectionDetailData) => item.enable && !item.open)}
            template={template}
          />
        </Grid>
        <Grid item xs={12}>
          <Group
            key={'group'}
            data={groups?.filter((item) => {
              if (!expired_status0IsChecked && isActive(item.expired_status)) {
                return false;
              }
              if (!expired_status1IsChecked && item.expired_status === ExpiredStatus.ReviewFailed) {
                return false;
              }
              if (!expired_status2IsChecked && item.expired_status === ExpiredStatus.ByMaster) {
                return false;
              }
              if (!expired_status3IsChecked && item.expired_status === ExpiredStatus.ByCommittee) {
                return false;
              }
              if (!member_type90IsChecked && item.member_type === MemberType.CommitteeFree) {
                return false;
              }
              if (!member_type99IsChecked && item.member_type === MemberType.Disable) {
                return false;
              }
              if (hasEnabledServiceIsChecked) {
                if (service?.filter((s) => s.group_id === item.ID && s.enable).length === 0) {
                  return false;
                }
              }
              if (hasEnabledConnectionIsChecked) {
                if (
                  connection?.filter((c) => c.service?.group_id === item.ID && c.enable).length ===
                  0
                ) {
                  return false;
                }
              }

              return true;
            })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={expired_status0IsChecked}
                onChange={() => setExpired_status0IsChecked(!expired_status0IsChecked)}
              />
            }
            label="通常"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={expired_status1IsChecked}
                onChange={() => setExpired_status1IsChecked(!expired_status1IsChecked)}
              />
            }
            label={expiredStatusLabels[ExpiredStatus.ReviewFailed]}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={expired_status2IsChecked}
                onChange={() => setExpired_status2IsChecked(!expired_status2IsChecked)}
              />
            }
            label="ユーザにより廃止"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={expired_status3IsChecked}
                onChange={() => setExpired_status3IsChecked(!expired_status3IsChecked)}
              />
            }
            label="運営委員により廃止"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={member_type90IsChecked}
                onChange={() => setMember_type90IsChecked(!member_type90IsChecked)}
              />
            }
            label="member_type: 90"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={member_type99IsChecked}
                onChange={() => setMember_type99IsChecked(!member_type99IsChecked)}
              />
            }
            label="member_type: 99"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasEnabledServiceIsChecked}
                onChange={() => setHasEnabledServiceIsChecked(!hasEnabledServiceIsChecked)}
              />
            }
            label="有効なサービスありのグループのみを表示"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={hasEnabledConnectionIsChecked}
                onChange={() => setHasEnabledConnectionIsChecked(!hasEnabledConnectionIsChecked)}
              />
            }
            label="有効なコネクションありのグループのみを表示"
          />
          <Button onClick={() => setGroupDialogIsOpen(!groupDialogIsOpen)}>
            (メール送信用)メールアドレス一覧表示
          </Button>
          {groupDialogIsOpen ? (
            <p>
              {groups
                ?.filter((item) => {
                  if (!expired_status0IsChecked && isActive(item.expired_status)) {
                    return false;
                  }
                  if (
                    !expired_status1IsChecked &&
                    item.expired_status === ExpiredStatus.ReviewFailed
                  ) {
                    return false;
                  }
                  if (!expired_status2IsChecked && item.expired_status === ExpiredStatus.ByMaster) {
                    return false;
                  }
                  if (
                    !expired_status3IsChecked &&
                    item.expired_status === ExpiredStatus.ByCommittee
                  ) {
                    return false;
                  }
                  if (!member_type90IsChecked && item.member_type === MemberType.CommitteeFree) {
                    return false;
                  }
                  if (!member_type99IsChecked && item.member_type === MemberType.Disable) {
                    return false;
                  }
                  if (hasEnabledServiceIsChecked) {
                    if (service?.filter((s) => s.group_id === item.ID && s.enable).length === 0) {
                      return false;
                    }
                  }
                  if (hasEnabledConnectionIsChecked) {
                    if (
                      connection?.filter((c) => c.service?.group_id === item.ID && c.enable)
                        .length === 0
                    ) {
                      return false;
                    }
                  }

                  if (item.member_expired === '' || item.member_expired === null) {
                    return true;
                  }
                  if (new Date() < new Date(item.member_expired.split('T')[0])) {
                    return false;
                  }
                  return true;
                })
                .map((group) =>
                  group.users
                    ?.filter((user) => canManageServices(user.level))
                    .map((user) => user.email + ','),
                )}
            </p>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <MemoGroup key={'group_memo'} data={groups} />
        </Grid>
      </Grid>
    </DashboardComponent>
  );
}
