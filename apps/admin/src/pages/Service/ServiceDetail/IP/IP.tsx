import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { DeleteAlertDialog } from '../../../../components/Dashboard/Alert/Alert';
import { Enable } from '../../../../components/Dashboard/Open/Open';
import { useCatalog } from '../../../../hooks/useCatalog';
import type { CatalogData, IPData, PlanData } from '../../../../interface';
import { api } from '../../../../lib/api';
import {
  StyledCardRoot2,
  StyledRootForm,
  StyledTableRowRoot,
  StyledTextFieldShort,
  StyledTextFieldTooVeryShort,
} from '../../../../style';
import { AddAssignIPDialog } from './IPAdd';

export function IPOpenButton(props: {
  ip: IPData;
  lockInfo: boolean;
  setLockInfo: Dispatch<SetStateAction<boolean>>;
  template: CatalogData;
}) {
  const { ip, lockInfo, setLockInfo } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const putIPMutation = useMutation({
    mutationFn: (req: IPData) => api.put('/ip/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      setLockInfo(true);
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  // Update IP Information
  const updateInfo = (open: boolean) => {
    ip.open = open;
    putIPMutation.mutate(ip);
  };

  if (!ip.open) {
    return (
      <Button size="small" color="primary" disabled={lockInfo} onClick={() => updateInfo(true)}>
        有効
      </Button>
    );
  }
  return (
    <Button size="small" color="secondary" disabled={lockInfo} onClick={() => updateInfo(false)}>
      無効
    </Button>
  );
}

export function ServiceIPBase(props: {
  serviceID: number;
  ip: IPData[] | undefined;
}) {
  const { ip, serviceID } = props;
  const { data: template } = useCatalog();

  if (ip === undefined) {
    return (
      <Card>
        <CardContent>
          <h3>IP</h3>
          <p>
            <b>情報なし</b>
          </p>
        </CardContent>
      </Card>
    );
  }
  return <ServiceIP key={serviceID} serviceID={serviceID} ip={ip} template={template} />;
}

export function ServiceIP(props: {
  serviceID: number;
  ip: IPData[];
  template: CatalogData;
}) {
  const { ip, serviceID, template } = props;

  return (
    <StyledCardRoot2>
      <CardContent>
        <h3>IP</h3>
        <TableContainer component={Paper}>
          <AddAssignIPDialog key={'add_assign_ip_dialog'} serviceID={serviceID} />
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">IP</TableCell>
                <TableCell align="right">Open</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ip.map((row) => (
                <ServiceIPRow key={row.ID} serviceID={serviceID} ip={row} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </StyledCardRoot2>
  );
}

export function ServiceIPRow(props: {
  serviceID: number;
  ip: IPData;
  template: CatalogData;
}) {
  const { ip: originalIP, serviceID, template } = props;
  const [open, setOpen] = React.useState(false);
  const [lockInfo, setLockInfo] = React.useState(true);
  const [ip, setIP] = useState(originalIP);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const clickLockInfo = () => {
    setLockInfo(!lockInfo);
  };
  const resetAction = () => {
    setIP(originalIP);
    setLockInfo(true);
  };

  const putIPMutation = useMutation({
    mutationFn: (req: IPData) => api.put('/ip/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      setLockInfo(true);
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  const updateInfo = () => {
    putIPMutation.mutate(ip);
  };

  const deleteIPMutation = useMutation({
    mutationFn: (id: number) => api.delete('/ip/' + id),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  const deleteIP = () => {
    deleteIPMutation.mutate(ip.ID);
  };

  return (
    <React.Fragment>
      <StyledTableRowRoot>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {ip.ID}
        </TableCell>
        <TableCell align="left">{ip.name}</TableCell>
        <TableCell align="left">{ip.ip}</TableCell>
        <TableCell align="right">
          <Enable open={ip.open} />
        </TableCell>
      </StyledTableRowRoot>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <StyledRootForm noValidate autoComplete="off">
                <StyledTextFieldShort
                  required
                  id="outlined-required"
                  label="Name"
                  defaultValue={ip.name}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  variant="outlined"
                  onChange={(event) => {
                    setIP({ ...ip, name: event.target.value });
                  }}
                />
                <StyledTextFieldShort
                  required
                  id="outlined-required"
                  label="IP"
                  defaultValue={ip.ip}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  variant="outlined"
                  onChange={(event) => {
                    setIP({ ...ip, ip: event.target.value });
                  }}
                />
              </StyledRootForm>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Button
                    size="small"
                    color="secondary"
                    disabled={!lockInfo}
                    onClick={clickLockInfo}
                  >
                    ロック解除
                  </Button>
                  <Button size="small" disabled={lockInfo} onClick={resetAction}>
                    Reset
                  </Button>
                  <IPOpenButton
                    ip={ip}
                    lockInfo={lockInfo}
                    setLockInfo={setLockInfo}
                    template={template}
                  />
                  <Button size="small" disabled={lockInfo} onClick={updateInfo}>
                    更新
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DeleteAlertDialog
                    key={'ip_delete_alert_dialog_' + ip.ID}
                    setDeleteProcess={deleteIP}
                  />
                </Grid>
              </Grid>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>直後</TableCell>
                    <TableCell>半年後</TableCell>
                    <TableCell>1年後</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <ServiceIPPlanBase
                    key={'service_ip_plan_base'}
                    serviceID={serviceID}
                    plan={ip.plan}
                  />
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function ServiceIPPlanBase(props: {
  serviceID: number;
  plan: PlanData[] | undefined;
}) {
  const { plan, serviceID } = props;

  if (plan === undefined) {
    return (
      <p>
        <b>情報なし</b>
      </p>
    );
  }
  return (
    <>
      {plan.map((row) => (
        <ServiceIPPlanRow key={'ip_plan_' + row.ID} serviceID={serviceID} plan={row} />
      ))}
    </>
  );
}

export function ServiceIPPlanRow(props: {
  serviceID: number;
  plan: PlanData;
}) {
  const { plan } = props;
  const [open, setOpen] = React.useState(false);
  const [lockInfo, setLockInfo] = React.useState(true);
  const [ipPlanCopy, setIPPlanCopy] = useState(plan);
  const [deleteIPPlan, setDeleteIPPlan] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const clickLockInfo = () => {
    setLockInfo(!lockInfo);
  };
  const resetAction = () => {
    setIPPlanCopy(plan);
    setLockInfo(true);
  };

  const putPlanMutation = useMutation({
    mutationFn: (req: PlanData) => api.put('/plan/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      setLockInfo(true);
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  // Update Plan Information
  const updateInfo = () => {
    putPlanMutation.mutate(ipPlanCopy);
  };

  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => api.delete('/plan/' + id),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
      setLockInfo(true);
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['service'] });
    },
  });

  useEffect(() => {
    if (deleteIPPlan) {
      deletePlanMutation.mutate(plan.ID);
      setDeleteIPPlan(false);
    }
  }, [deleteIPPlan]);

  return (
    <React.Fragment>
      <StyledTableRowRoot>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {plan.ID}
        </TableCell>
        <TableCell align="left">{plan.name}</TableCell>
        <TableCell align="right">{plan.after}</TableCell>
        <TableCell align="right">{plan.half_year}</TableCell>
        <TableCell align="right">{plan.one_year}</TableCell>
      </StyledTableRowRoot>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <StyledRootForm noValidate autoComplete="off">
                <StyledTextFieldShort
                  required
                  id="outlined-required"
                  label="Name"
                  defaultValue={plan.name}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  variant="outlined"
                  onChange={(event) => {
                    setIPPlanCopy({ ...ipPlanCopy, name: event.target.value });
                  }}
                />
                <br />
                <StyledTextFieldTooVeryShort
                  required
                  id="outlined-required"
                  label="直後"
                  defaultValue={plan.after}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  type="number"
                  variant="outlined"
                  onChange={(event) => {
                    setIPPlanCopy({
                      ...ipPlanCopy,
                      after: Number(event.target.value),
                    });
                  }}
                />
                <StyledTextFieldTooVeryShort
                  required
                  id="outlined-required"
                  label="半年後"
                  defaultValue={plan.half_year}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  type="number"
                  variant="outlined"
                  onChange={(event) => {
                    setIPPlanCopy({
                      ...ipPlanCopy,
                      half_year: Number(event.target.value),
                    });
                  }}
                />
                <StyledTextFieldTooVeryShort
                  required
                  id="outlined-required"
                  label="1年後"
                  defaultValue={plan.one_year}
                  InputProps={{
                    readOnly: lockInfo,
                  }}
                  type="number"
                  variant="outlined"
                  onChange={(event) => {
                    setIPPlanCopy({
                      ...ipPlanCopy,
                      one_year: Number(event.target.value),
                    });
                  }}
                />
              </StyledRootForm>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    size="small"
                    color="secondary"
                    disabled={!lockInfo}
                    onClick={clickLockInfo}
                  >
                    ロック解除
                  </Button>
                  <Button size="small" disabled={lockInfo} onClick={resetAction}>
                    Reset
                  </Button>
                  <Button size="small" disabled={lockInfo} onClick={updateInfo}>
                    Apply
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DeleteAlertDialog
                    key={'plan_delete_alert_dialog_' + plan.ID}
                    setDeleteProcess={setDeleteIPPlan}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
