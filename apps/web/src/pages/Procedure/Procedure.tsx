import React, { useEffect } from 'react'
import DashboardComponent from '../../components/Dashboard/Dashboard'
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { clearInfos, clearTemplates } from '../../store/action/Actions'
import store, { RootState } from '../../store'
import { InfoData, TicketData } from '../../interface'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { Get } from '../../api/Info'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { UserAddDialog } from './UserAddDialog/UserAddDialog'
import { RequestAddDialog } from './RequestAddDialog/RequestAddDialog'
import { GroupChangeDialog } from './Group/GroupChangeDialog'
import { StyledCardRoot3, StyledTable2 } from '../../style'

export default function Procedure() {
  const [data, setData] = React.useState<InfoData>()
  const infos = useSelector((state: RootState) => state.infos)
  const templates = useSelector((state: RootState) => state.templates)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // info
    const length = infos.length
    const tmpData = infos[length - 1]

    if (tmpData.error !== undefined || tmpData.data != null) {
      if (tmpData.error !== undefined) {
        if (tmpData.error?.indexOf('[401]') !== -1) {
          Cookies.remove('user_token')
          Cookies.remove('access_token')
          store.dispatch(clearInfos())
          store.dispatch(clearTemplates())
          enqueueSnackbar(tmpData.error, { variant: 'error' })
          navigate('/login')
        } else {
          enqueueSnackbar(tmpData.error, { variant: 'error' })
        }
      } else if (tmpData.data != null) {
        setData(tmpData.data)
      }
    } else {
      Get().then()
      const date = new Date()
      enqueueSnackbar('Info情報の更新: ' + date.toLocaleString(), {
        variant: 'info',
      })
    }

    // template
  }, [infos, templates])

  const UserListPage = () => navigate('/dashboard/procedure/user')
  const ServiceListPage = () => navigate('/dashboard/procedure/service')
  const ConnectionListPage = () => navigate('/dashboard/procedure/connection')

  return (
    <DashboardComponent title="各種手続き">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h3>申請状況</h3>
          {data != null && data?.request == null && (
            <h2>申請履歴がありません</h2>
          )}
          {data != null && data.request != null && (
            <StatusTable
              key={'status_table'}
              request={data?.request.sort((a, b) => b.id - a.id)}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {data != null && data?.user != null && data.user?.group_id !== 0 && (
            <StyledCardRoot3 key={'add_user'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  ユーザ追加手続き
                </Typography>
                <br />
                グループにユーザ追加を希望される方はお選びください。
              </CardContent>
              <CardActions>
                <UserAddDialog groupID={data.user.group_id} />
              </CardActions>
            </StyledCardRoot3>
          )}
          <StyledCardRoot3 key={'change_user'}>
            <CardContent>
              <Typography variant="h5" component="h2">
                ユーザ情報変更手続き
              </Typography>
              <br />
              メールアドレス、パスワード、ユーザ情報の変更を希望される方はお選びください。
            </CardContent>
            <CardActions>
              <Button variant="outlined" onClick={UserListPage}>
                {' '}
                次へ{' '}
              </Button>
            </CardActions>
          </StyledCardRoot3>
          {data != null &&
            data?.user != null &&
            data.user?.group_id !== 0 &&
            data.group != null && (
              <StyledCardRoot3 key={'change_group'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    グループ情報変更手続き
                  </Typography>
                  <br />
                  グループ情報の変更を希望される方はお選びください。
                </CardContent>
                <CardActions>
                  <GroupChangeDialog
                    key={'request_abolished_group'}
                    group={data.group}
                  />
                </CardActions>
              </StyledCardRoot3>
            )}
          {data != null && data?.group != null && !data.group?.add_allow && (
            <StyledCardRoot3 key={'add_service'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  サービス追加手続き
                </Typography>
                <br />
                サービス情報の追加を希望される方はお選びください。
              </CardContent>
              <CardActions>
                <RequestAddDialog
                  key={'request_add_service'}
                  title={'[追加] サービス情報申請'}
                />
              </CardActions>
            </StyledCardRoot3>
          )}
          {data != null &&
            data?.service != null &&
            data.service?.filter((value) => !value.pass).length > 0 && (
              <StyledCardRoot3 key={'change_abolished_service'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    サービスの変更/廃止手続き
                  </Typography>
                  <br />
                  サービス情報の変更（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報の変更、IPアドレス廃止をご希望の方）
                  <br />
                  サービス情報の廃止（ご契約頂いているサービスごと廃止をご希望の方）
                  <br />
                  以上に当てはまる方は、お選びください
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={ServiceListPage}>
                    次へ
                  </Button>
                </CardActions>
              </StyledCardRoot3>
            )}
          {data != null &&
            data?.service != null &&
            data.service?.filter((value) => value.add_allow).length > 0 && (
              <StyledCardRoot3 key={'add_connection'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    接続追加手続き
                  </Typography>
                  <br />
                  接続情報の追加を希望される方はお選びください。
                </CardContent>
                <CardActions>
                  <RequestAddDialog
                    key={'request_add_connection'}
                    title={'[追加] 接続情報申請'}
                  />
                </CardActions>
              </StyledCardRoot3>
            )}
          {data != null &&
            data?.connection != null &&
            data.connection?.filter((value) => !value.open).length > 0 && (
              <StyledCardRoot3 key={'change_abolished_connection'}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    接続の変更/廃止手続き
                  </Typography>
                  <br />
                  接続情報の変更（IPアドレスやNOCの収容変更をご希望の方）
                  <br />
                  接続情報の廃止（接続の廃止をご希望の方）
                  <br />
                  以上に当てはまる方は、お選びください
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={ConnectionListPage}>
                    次へ
                  </Button>
                </CardActions>
              </StyledCardRoot3>
            )}
          {data != null && data?.user != null && data.user?.group_id !== 0 && (
            <StyledCardRoot3 key={'abolished_group'}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  退会手続き
                </Typography>
                <br />
                退会をご希望の方はこちらをお選びください。
              </CardContent>
              <CardActions>
                <RequestAddDialog
                  key={'request_abolished_group'}
                  title={'[退会] グループの退会申請'}
                />
              </CardActions>
            </StyledCardRoot3>
          )}
        </Grid>
      </Grid>
    </DashboardComponent>
  )
}

export function StatusTable(props: { request: TicketData[] }) {
  const { request } = props
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, request.length - page * rowsPerPage)

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const ChatPage = (id: number) => navigate('/dashboard/support/' + id)

  return (
    <Box>
      <TableContainer component={Paper}>
        <StyledTable2 size="small" aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>申請内容</TableCell>
              <TableCell align="right">作成日</TableCell>
              <TableCell align="right">状況</TableCell>
              <TableCell align="right">機能</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? request.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : request
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell style={{ width: 300 }} align="right">
                  {row.created_at}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {row.reject && (
                    <Chip size="small" color="secondary" label="却下" />
                  )}
                  {!row.reject && !row.solved && (
                    <Chip size="small" color="primary" label="申請中" />
                  )}
                  {!row.reject && row.solved && (
                    <Chip size="small" color="primary" label="承諾/変更済み" />
                  )}
                </TableCell>
                <TableCell style={{ width: 100 }} align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => ChatPage(row.id)}
                  >
                    Chat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </StyledTable2>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={request.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
