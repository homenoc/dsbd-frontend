import { ConnectionTypeCode } from '@dsbd/shared';
import {
  Button,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import React, { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../../../components/Dashboard/Dashboard';
import { Open } from '../../../components/Dashboard/Open/Open';
import { GenServiceCode } from '../../../components/Tool';
import { useCatalog } from '../../../hooks/useCatalog';
import { useConnection } from '../../../hooks/useResources';
import { useBGPRouters, useGatewayIPs } from '../../../hooks/useResources';
import type {
  BGPRouterDetailData,
  ConnectionDetailData,
  TunnelEndPointRouterIPTemplateData,
} from '../../../interface';
import { api } from '../../../lib/api';
import { findConnectionType, findServiceType } from '../../../lib/tool';
import {
  StyledButton1,
  StyledCardRoot3,
  StyledChip1,
  StyledChip2,
  StyledFormControlFormLong,
  StyledFormControlFormMedium,
  StyledTextFieldLong,
  StyledTextFieldMedium,
} from '../../../style';
import classes from './ConnectionDialog.module.scss';

export default function ConnectionDetail() {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { data: connection, error } = useConnection(Number(id));

  useEffect(() => {
    if (error) {
      enqueueSnackbar(String((error as Error).message), { variant: 'error' });
    }
  }, [error]);

  return (
    <Dashboard title="Connection Detail">
      {/* The child cards copy `connection` into local edit state on mount, so we
          must not mount them until Get has resolved — otherwise they would
          freeze empty data and later PUT it back. Keying by ID also remounts
          them with fresh data when the loaded connection changes. */}
      {connection && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ConnectionStatus key={`connectionStatus_${connection.ID}`} connection={connection} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ConnectionEtc key={`connectionETC_${connection.ID}`} connection={connection} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ConnectionOpen key={`connection_open_${connection.ID}`} connection={connection} />
          </Grid>
          <Grid item xs={12}>
            <ConnectionUserDisplay
              key={`connection_user_display_${connection.ID}`}
              connection={connection}
            />
          </Grid>
          <Grid item xs={12}>
            <ConnectionEtc2 key={`connection_etc2_${connection.ID}`} connection={connection} />
          </Grid>
        </Grid>
      )}
    </Dashboard>
  );
}

export function ConnectionOpenButton(props: {
  connection: ConnectionDetailData;
  lock: boolean;
}) {
  const { connection, lock } = props;
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (req: ConnectionDetailData) => api.put('/connection/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['connection'] });
    },
  });

  // Update Service Information
  const updateInfo = (open: boolean) => {
    connection.open = open;
    connection.bgp_router = undefined;
    connection.tunnel_endpoint_router_ip = undefined;
    updateMutation.mutate(connection);
  };

  if (!connection.open) {
    return (
      <Button
        size="small"
        color="primary"
        variant="contained"
        disabled={lock}
        onClick={() => updateInfo(true)}
      >
        開通
      </Button>
    );
  }
  return (
    <Button
      size="small"
      color="secondary"
      variant="contained"
      disabled={lock}
      onClick={() => updateInfo(false)}
    >
      未開通
    </Button>
  );
}

export function ConnectionOpen(props: { connection: ConnectionDetailData }) {
  const { connection: original_connection } = props;
  const queryClient = useQueryClient();
  const { data: bgpRouters } = useBGPRouters();
  const { data: gatewayIPs } = useGatewayIPs();
  const [connection, setConnection] = useState(original_connection);
  const [lock, setLock] = React.useState(true);

  const clickLockInfo = () => {
    setLock(!lock);
  };
  const resetAction = () => {
    setConnection(original_connection);
    setLock(true);
  };
  const updateMutation = useMutation({
    mutationFn: (req: ConnectionDetailData) => api.put('/connection/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['connection'] });
    },
  });

  const updateInfo = () => {
    connection.bgp_router = undefined;
    connection.tunnel_endpoint_router_ip = undefined;
    updateMutation.mutate(connection);
  };

  return (
    <div>
      <StyledCardRoot3>
        <CardContent>
          <br />
          <ConnectionOpenL3User
            key={'connection_open_l3_user'}
            connection={connection}
            setConnection={setConnection}
            lock={lock}
          />
          <ConnectionOpenVPN
            key={'Open_VPN'}
            connection={connection}
            setConnection={setConnection}
            lock={lock}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={connection.rfc8950}
                onChange={(event) => {
                  setConnection((prev) => ({
                    ...prev,
                    rfc8950: event.target.checked,
                  }));
                }}
                disabled={lock}
              />
            }
            label="RFC8950利用"
          />
          <StyledFormControlFormMedium variant="outlined">
            <InputLabel id="bgp_router_input">BGP Router</InputLabel>
            <Select
              labelId="bgp_router_hostname"
              id="bgp_router_hostname"
              label="BGP Router"
              value={connection.bgp_router_id ?? 0}
              onChange={(event) =>
                setConnection({
                  ...connection,
                  bgp_router_id: Number(event.target.value),
                })
              }
              inputProps={{
                readOnly: lock,
              }}
              type="number"
            >
              <MenuItem value={0}>なし(初期値)</MenuItem>
              {bgpRouters
                .filter((router) => router.enable === true)
                .map((row: BGPRouterDetailData) => (
                  <MenuItem key={row.ID + row.hostname} value={row.ID}>
                    {row.hostname}
                  </MenuItem>
                ))}
            </Select>
          </StyledFormControlFormMedium>
          <br />
          <StyledFormControlFormLong variant="outlined">
            <InputLabel id="tunnel_endpoint_router_ip_input">Tunnel EndPoint Router IP</InputLabel>
            <Select
              labelId="tunnel_endpoint_router_ip"
              id="tunnel_endpoint_router_ip"
              label="Tunnel EndPoint Router IP"
              value={connection.tunnel_endpoint_router_ip_id ?? 0}
              onChange={(event) =>
                setConnection({
                  ...connection,
                  tunnel_endpoint_router_ip_id: Number(event.target.value),
                })
              }
              inputProps={{
                readOnly: lock,
              }}
              type="number"
            >
              <MenuItem value={0}>なし(初期値)</MenuItem>
              {gatewayIPs
                .filter((ip) => ip.enable === true)
                .map((row: TunnelEndPointRouterIPTemplateData) => (
                  <MenuItem key={row.ID + row.ip} value={row.ID}>
                    {row.tunnel_endpoint_router.hostname}
                    <b>({row.ip})</b>
                  </MenuItem>
                ))}
            </Select>
          </StyledFormControlFormLong>
          <br />
          <Stack direction="row" spacing={1}>
            <Button size="small" color="secondary" disabled={!lock} onClick={clickLockInfo}>
              ロック解除
            </Button>
            <Button size="small" disabled={lock} onClick={resetAction}>
              Reset
            </Button>
            <Button size="small" color="primary" disabled={lock} onClick={() => updateInfo()}>
              保存
            </Button>
            <ConnectionOpenButton
              key={'connection_open_button'}
              connection={connection}
              lock={lock}
            />
          </Stack>
        </CardContent>
      </StyledCardRoot3>
    </div>
  );
}

export function ConnectionOpenVPN(props: {
  connection: ConnectionDetailData;
  setConnection: Dispatch<SetStateAction<ConnectionDetailData>>;
  lock: boolean;
}) {
  const { connection, setConnection, lock } = props;

  if (connection.connection_type === '') {
    return null;
  }
  return (
    <div>
      <StyledTextFieldLong
        required
        id="dest_address"
        label="対向終端アドレス"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.term_ip ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, term_ip: event.target.value });
        }}
      />
      <br />
    </div>
  );
}

export function ConnectionOpenL3User(props: {
  connection: ConnectionDetailData;
  setConnection: Dispatch<SetStateAction<ConnectionDetailData>>;
  lock: boolean;
}) {
  const { connection, setConnection, lock } = props;
  const { data: template } = useCatalog();

  if (
    connection.service === undefined ||
    !template.services?.find((ser) => ser.type === connection.service?.service_type)?.need_route
  ) {
    return null;
  }
  return (
    <div>
      {!connection.rfc8950 && (
        <>
          <StyledTextFieldMedium
            required
            id="l3_ipv4_admin"
            label="L3 IPv4(HomeNOC側)"
            InputProps={{
              readOnly: lock,
            }}
            value={connection.link_v4_our ?? ''}
            variant="outlined"
            onChange={(event) => {
              setConnection({ ...connection, link_v4_our: event.target.value });
            }}
          />
          <StyledTextFieldMedium
            required
            id="l3_ipv4_user"
            label="L3 IPv4(ユーザ側)"
            InputProps={{
              readOnly: lock,
            }}
            value={connection.link_v4_your ?? ''}
            variant="outlined"
            onChange={(event) => {
              setConnection({ ...connection, link_v4_your: event.target.value });
            }}
          />
        </>
      )}
      <br />
      <StyledTextFieldMedium
        required
        id="l3_ipv6_admin"
        label="L3 IPv6(HomeNOC側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_our ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_our: event.target.value });
        }}
      />
      <StyledTextFieldMedium
        required
        id="l3_ipv6_user"
        label="L3 IPv6(ユーザ側)"
        InputProps={{
          readOnly: lock,
        }}
        value={connection.link_v6_your ?? ''}
        variant="outlined"
        onChange={(event) => {
          setConnection({ ...connection, link_v6_your: event.target.value });
        }}
      />
    </div>
  );
}

export function ConnectionStatus(props: { connection: ConnectionDetailData }) {
  const { connection } = props;
  const { data: template } = useCatalog();
  const serviceCode = GenServiceCode(connection);
  const createDate = '作成日: ' + connection.CreatedAt;
  const updateDate = '更新日: ' + connection.UpdatedAt;

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>ServiceCode</h3>
            <StyledChip2 size="small" color="primary" label={serviceCode} />
            <h3>Service Type</h3>
            <StyledChip2
              size="small"
              color="primary"
              label={
                findConnectionType(template.connections, connection.connection_type)?.name ?? ''
              }
            />
          </Grid>
          <Grid item xs={6}>
            <h3>BGP IPv4</h3>
            {connection.ipv4_route !== '' && (
              <Chip size="small" color="primary" label={connection.ipv4_route} />
            )}
          </Grid>
          <Grid item xs={6}>
            <h3>BGP IPv6</h3>
            {connection.ipv6_route !== '' && (
              <Chip size="small" color="primary" label={connection.ipv6_route} />
            )}
          </Grid>
          {connection.ix && (
            <Grid item xs={12}>
              <h3>IX接続</h3>
              <StyledChip2 size="small" color="primary" label={connection.ix} />
              {connection.ix_peer_type && (
                <Chip size="small" color="primary" label={connection.ix_peer_type} />
              )}
              {connection.ix_peer_type === 'PI/CUG' && connection.ix_vlan_id && (
                <Chip size="small" color="secondary" label={`VLAN: ${connection.ix_vlan_id}`} />
              )}
            </Grid>
          )}
          <Grid item xs={12}>
            <h3>Date</h3>
            <StyledChip1 size="small" color="primary" label={createDate} />
            <Chip size="small" color="primary" label={updateDate} />
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  );
}

export function ConnectionEtc(props: { connection: ConnectionDetailData }) {
  const { connection } = props;
  const navigate = useNavigate();
  const clickGroupPage = () => navigate('/dashboard/group/' + connection.service?.group_id);

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h3>開通情報</h3>
            <Open open={connection.open} />
            <h3>インターネット接続性</h3>
            {connection.ntt}
          </Grid>
          <Grid item xs={4}>
            <h3>希望接続</h3>
            <Chip size="small" color="primary" label={connection.preferred_ap} />
          </Grid>
          <Grid item xs={8}>
            <h3>設置場所</h3>
            {connection.address}
          </Grid>
          <Grid item xs={12}>
            <h3>監視要求</h3>
            <ConnectionMonitorDisplay key={'ConnectionMonitor'} monitor={connection.monitor} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button
                size={'small'}
                onClick={() => clickGroupPage()}
                color={'primary'}
                variant="contained"
              >
                Group
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  );
}

export function ConnectionMonitorDisplay(props: { monitor: boolean }) {
  const { monitor } = props;

  if (monitor) {
    return <Chip size="small" color="primary" label="必要" />;
  }
  return <Chip size="small" color="secondary" label="不必要" />;
}

export function ConnectionUserDisplay(props: {
  connection: ConnectionDetailData;
}) {
  const { connection } = props;
  const { data: template } = useCatalog();

  const distinctionIPAssign = (our: boolean) => {
    if (our) {
      return <td>当団体からアドレスを割当</td>;
    }
    return <td>貴団体からアドレスを割当</td>;
  };
  const getNOCName = () => {
    if (connection.bgp_router_id === 0 || connection.bgp_router === undefined) {
      return '希望NOCなし';
    }
    return connection.bgp_router?.noc.name;
  };

  return (
    <div className={classes.contract}>
      <StyledCardRoot3>
        <CardContent>
          <h2>User側の表示</h2>

          <table aria-colspan={2}>
            <thead>
              <tr>
                <th colSpan={2}>内容</th>
              </tr>
              <tr>
                <th>サービス種別</th>
                <td>
                  {findConnectionType(template.connections, connection.connection_type)?.name ?? ''}
                </td>
              </tr>
              <tr>
                <th>利用料金</th>
                <td>0円</td>
              </tr>
              <tr>
                <th>当団体からのIPアドレスの割当</th>
                {distinctionIPAssign(
                  findServiceType(template.services, connection.service?.service_type ?? '')
                    ?.need_jpnic ?? false,
                )}
              </tr>
            </thead>
          </table>
          <br />
          <table className={classes.contract}>
            <thead>
              <tr>
                <th colSpan={3}>接続情報</th>
              </tr>
              <tr>
                <th>接続方式</th>
                <td colSpan={2}>
                  {findConnectionType(template.connections, connection.connection_type)?.name ?? ''}
                </td>
              </tr>
              {connection.connection_type !== ConnectionTypeCode.IX && (
                <tr>
                  <th>接続NOC</th>
                  <td colSpan={2}>{getNOCName()}</td>
                </tr>
              )}
              {connection.ix && (
                <>
                  <tr>
                    <th>IX</th>
                    <td colSpan={2}>{connection.ix}</td>
                  </tr>
                  <tr>
                    <th>ピアリングタイプ</th>
                    <td colSpan={2}>{connection.ix_peer_type}</td>
                  </tr>
                  {connection.ix_peer_type === 'PI/CUG' && connection.ix_vlan_id && (
                    <tr>
                      <th>VLAN-ID</th>
                      <td colSpan={2}>{connection.ix_vlan_id}</td>
                    </tr>
                  )}
                </>
              )}
              {connection.connection_type !== ConnectionTypeCode.IX && (
                <>
                  <tr>
                    <th>トンネル終端アドレス（貴団体側）</th>
                    <td colSpan={2}>{connection.term_ip}</td>
                  </tr>
                  <tr>
                    <th>トンネル終端アドレス（当団体側）</th>
                    <td colSpan={2}>{connection.tunnel_endpoint_router_ip?.ip}</td>
                  </tr>
                </>
              )}
              <tr>
                <th>RFC8950利用</th>
                <td colSpan={2}>{connection.rfc8950 ? 'あり' : 'なし'}</td>
              </tr>
              <tr>
                <th colSpan={3}>当団体との間の境界アドレス</th>
              </tr>
              <tr>
                <th />
                <th>IPv4アドレス</th>
                <th>IPv6アドレス</th>
              </tr>
              <tr>
                <th>当団体側</th>
                <td>{connection.rfc8950 ? 'RFC8950利用のため無し' : connection.link_v4_our}</td>
                <td>{connection.link_v6_our}</td>
              </tr>
              <tr>
                <th>貴団体側</th>
                <td>{connection.rfc8950 ? 'RFC8950利用のため無し' : connection.link_v4_your}</td>
                <td>{connection.link_v6_your}</td>
              </tr>
            </thead>
          </table>
        </CardContent>
      </StyledCardRoot3>
    </div>
  );
}

export function ConnectionEtc2(props: { connection: ConnectionDetailData }) {
  const { connection: original_connection } = props;
  const queryClient = useQueryClient();
  const [lock, setLockInfo] = React.useState(true);
  const [connection, setConnection] = useState(original_connection);
  const { enqueueSnackbar } = useSnackbar();
  const { data: template } = useCatalog();

  const clickLockInfo = () => {
    setLockInfo(!lock);
  };
  const resetAction = () => {
    setConnection(original_connection);
    setLockInfo(true);
  };

  const putMutation = useMutation({
    mutationFn: (req: ConnectionDetailData) => api.put('/connection/' + req.ID, req),
    onSuccess: () => {
      enqueueSnackbar('Request Success', { variant: 'success' });
      setLockInfo(true);
    },
    onError: (e) => {
      enqueueSnackbar(String((e as Error).message), { variant: 'error' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['connection'] });
    },
  });

  // Update Group Information
  const updateInfo = () => {
    putMutation.mutate(connection);
  };

  return (
    <StyledCardRoot3>
      <CardContent>
        <Grid>
          <h3>その他情報</h3>
        </Grid>
        <Grid container spacing={3}>
          {connection.connection_comment !== '' && (
            <Grid item xs={12}>
              <h4>ラックなどの追加情報(Connection Type Comment)</h4>
              {connection.connection_comment}
            </Grid>
          )}
          <Grid item xs={12}>
            <h4>Comment</h4>
            {connection.comment !== '' && <p>{connection.comment}</p>}
            {connection.comment === '' && <p>なし</p>}
          </Grid>
          <Grid item xs={12}>
            <h3>情報編集</h3>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id={'connection_type_label'}>接続タイプ(注意)</InputLabel>
              <Select
                labelId="connection_type_label"
                id="connection_type"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    connection_type: event.target.value,
                  });
                }}
                value={connection.connection_type}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.connections?.map((connect_type, index) => (
                  <MenuItem key={'connection_template' + index} value={connect_type.type}>
                    {connect_type.name}({connect_type.comment})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="ipv4_route_select_labellabel">IPv4 BGP広報経路</InputLabel>
              <Select
                labelId="ipv4_route_select_label"
                id="ipv4_route_select"
                label="IPv4 BGP広報経路"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ipv4_route: event.target.value,
                  });
                }}
                value={connection.ipv4_route ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ipv4_route?.map((v4Route, index) => (
                  <MenuItem key={'ipv4_route_' + index} value={v4Route}>
                    {v4Route}
                  </MenuItem>
                ))}
                <MenuItem key={'ipv4_route_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="ipv6_route_select_labellabel">IPv6 BGP広報経路</InputLabel>
              <Select
                labelId="ipv6_route_select_label"
                id="ipv6_route_select"
                label="IPv6 BGP広報経路"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ipv6_route: event.target.value,
                  });
                }}
                value={connection.ipv6_route ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ipv6_route?.map((v6Route, index) => (
                  <MenuItem key={'ipv6_route_' + index} value={v6Route}>
                    {v6Route}
                  </MenuItem>
                ))}
                <MenuItem key={'ipv6_route_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={6}>
            <FormControl fullWidth>
              <StyledTextFieldMedium
                label="終端先ユーザの都道府県市町村"
                id="address"
                InputProps={{
                  readOnly: lock,
                }}
                variant="outlined"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    address: event.target.value,
                  });
                }}
                value={connection.address ?? ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id={'preferred_ap_label'}>希望接続場所</InputLabel>
              <Select
                labelId="preferred_ap_label"
                id="preferred_ap"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    preferred_ap: event.target.value,
                  });
                }}
                value={connection.preferred_ap ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.preferred_ap?.map((row, index) => (
                  <MenuItem key={'preferred_ap_' + index} value={row}>
                    {row}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id={'ntt_label'}>インターネット接続性</InputLabel>
              <Select
                labelId="ntt_label"
                id="ntt"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ntt: event.target.value,
                  });
                }}
                value={connection.ntt ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                {template.ntts?.map((ntt, index) => (
                  <MenuItem key={'ntt_' + index} value={ntt}>
                    {ntt}
                  </MenuItem>
                ))}
                <MenuItem key={'ntt_none'} value={''}>
                  None
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id={'monitor_label'}>監視の有無</InputLabel>
              <Select
                labelId="monitor_label"
                id="monitor"
                aria-label="gender"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    monitor: Number(event.target.value) === 1,
                  });
                }}
                value={connection.monitor ? 1 : 0}
                inputProps={{
                  readOnly: lock,
                }}
              >
                <MenuItem key={'monitor_enable'} value={1}>
                  有効
                </MenuItem>
                <MenuItem key={'monitor_disable'} value={0}>
                  無効
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <br />
          <Grid item xs={12}>
            <h4>IX接続情報</h4>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id={'ix_label'}>IX</InputLabel>
              <Select
                labelId="ix_label"
                id="ix"
                aria-label="ix"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ix: event.target.value,
                  });
                }}
                value={connection.ix ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                <MenuItem key={'ix_none'} value={''}>
                  None
                </MenuItem>
                {template.ix?.map((ixTemplate, index) => (
                  <MenuItem key={'ix_' + index} value={ixTemplate.name}>
                    {ixTemplate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id={'ix_peer_type_label'}>ピアリングタイプ</InputLabel>
              <Select
                labelId="ix_peer_type_label"
                id="ix_peer_type"
                aria-label="ix_peer_type"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ix_peer_type: event.target.value,
                  });
                }}
                value={connection.ix_peer_type ?? ''}
                inputProps={{
                  readOnly: lock,
                }}
              >
                <MenuItem key={'ix_peer_type_none'} value={''}>
                  None
                </MenuItem>
                <MenuItem key={'ix_peer_type_public'} value={'パブリック'}>
                  パブリック
                </MenuItem>
                <MenuItem key={'ix_peer_type_pc_cug'} value={'PI/CUG'}>
                  PI/CUG
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <StyledTextFieldMedium
                label="IX VLAN-ID"
                id="ix_vlan_id"
                InputProps={{
                  readOnly: lock,
                }}
                variant="outlined"
                onChange={(event) => {
                  setConnection({
                    ...connection,
                    ix_vlan_id: event.target.value,
                  });
                }}
                value={connection.ix_vlan_id ?? ''}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button size="small" color="secondary" disabled={!lock} onClick={clickLockInfo}>
              ロック解除
            </Button>
            <Button size="small" onClick={resetAction} disabled={lock}>
              Reset
            </Button>
            <Button size="small" color="primary" disabled={lock} onClick={updateInfo}>
              Apply
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCardRoot3>
  );
}
