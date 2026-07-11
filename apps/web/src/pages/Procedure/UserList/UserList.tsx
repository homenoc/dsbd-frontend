import React, { useEffect, useState } from 'react'
import {
  Button,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../../../interface'
import { useSnackbar } from 'notistack'
import { useInfo } from '../../../hooks/useInfo'
import Dashboard from '../../../components/Dashboard/Dashboard'
import {
  StyledCardRoot3,
  StyledPaperRootInput,
  StyledSearchInput,
  StyledTypographyTitle,
} from '../../../style'

export default function UserList() {
  const [users, setUsers] = useState<UserData[]>([])
  const [initUsers, setInitUsers] = useState<UserData[]>([])
  const { data: infoData, error } = useInfo()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData?.user_list != null) {
      setInitUsers(infoData.user_list)
      setUsers(infoData.user_list)
    }
  }, [infoData])

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  const handleFilter = (search: string) => {
    let tmp: UserData[]
    if (search === '') {
      tmp = initUsers
    } else {
      tmp = initUsers.filter((user: UserData) => {
        const name = user.name + user.name_en
        return name.toLowerCase().includes(search.toLowerCase())
      })
    }
    setUsers(tmp)
  }

  const clickDetailPage = (id: number) => {
    navigate('/dashboard/procedure/user/' + id)
  }

  return (
    <Dashboard title="ユーザ一覧">
      <StyledPaperRootInput>
        <StyledSearchInput
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(event) => {
            handleFilter(event.target.value)
          }}
        />
      </StyledPaperRootInput>
      {users == null && <h3>現在、有効なユーザはありません。</h3>}
      {users !== null &&
        users.map((user: UserData, index) => (
          <StyledCardRoot3 key={'user_' + index}>
            <CardContent>
              <StyledTypographyTitle color="textSecondary" gutterBottom>
                ID: {user.id} ({user.email})
              </StyledTypographyTitle>
              <Typography variant="h5" component="h2">
                {user.name}({user.name_en})
              </Typography>
              <br />
              &nbsp;&nbsp;
              <MailVerify
                key={'mail_verify_' + index}
                mailVerify={user.mail_verify}
              />
              <br />
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => clickDetailPage(user.id)}>
                Detail
              </Button>
              {/*{*/}
              {/*    user.solved &&*/}
              {/*    <Button size="small" color="primary"*/}
              {/*            onClick={() => clickSolvedStatus(user.id, false)}>未解決</Button>*/}
              {/*}*/}
              {/*{*/}
              {/*    !user.solved &&*/}
              {/*    <Button size="small" color="secondary"*/}
              {/*            onClick={() => clickSolvedStatus(user.id, true)}>解決済み</Button>*/}
              {/*}*/}
            </CardActions>
          </StyledCardRoot3>
        ))}
    </Dashboard>
  )
}

function MailVerify(props: { mailVerify: boolean }): any {
  const { mailVerify } = props
  if (mailVerify) {
    return <Chip size="small" color="primary" label="メール確認済" />
  }
  return <Chip size="small" color="secondary" label="メール未確認" />
}
