import React, { useEffect, useRef, useState } from 'react'
import { TicketData, UserData } from '../../../interface'
import { restfulApiConfig } from '../../../api/Config'
import useWebSocket from 'react-use-websocket'
import { MessageLeft, MessageRight } from './Message'
import { TextInput } from './TextInput'
import { useSnackbar } from 'notistack'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store, { RootState } from '../../../store'
import Cookies from 'js-cookie'
import { clearInfos, clearTemplates } from '../../../store/action/Actions'
import { Get } from '../../../api/Info'
import DashboardComponent from '../../../components/Dashboard/Dashboard'
import { StyledPaperMessage } from '../styles'

export default function SupportDetail() {
  const { id } = useParams()
  const { sendMessage, lastMessage } = useWebSocket(
    restfulApiConfig.wsURL +
      '/support' +
      '?id=' +
      id +
      '&user_token=' +
      Cookies.get('user_token') +
      '&access_token=' +
      Cookies.get('access_token'),
    {
      onOpen: () =>
        enqueueSnackbar('WebSocket接続確立', { variant: 'success' }),
      onClose: () => enqueueSnackbar('WebSocket切断', { variant: 'error' }),
      shouldReconnect: () => true,
    }
  )
  const { enqueueSnackbar } = useSnackbar()
  const [inputChatData, setInputChatData] = useState('')
  const [ticket, setTicket] = useState<TicketData>()
  const [userList, setUserList] = useState<UserData[]>()
  const infos = useSelector((state: RootState) => state.infos)
  const [sendPush, setSendPush] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView()
  }, [ticket])

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
        } else {
          enqueueSnackbar(tmpData.error, { variant: 'error' })
        }
      } else if (tmpData.data != null) {
        if (tmpData.data.user_list != null) {
          setUserList(tmpData.data.user_list)
        }

        if (tmpData.data.ticket != null) {
          const ticketOne = tmpData.data.ticket.filter(
            (ticket) => ticket.id === Number(id)
          )
          if (ticketOne != null && ticketOne.length !== 0) {
            setTicket(ticketOne[0])
          }
        }

        if (tmpData.data.request != null) {
          const requestOne = tmpData.data.request.filter(
            (ticket) => ticket.id === Number(id)
          )
          if (requestOne != null && requestOne.length !== 0) {
            setTicket(requestOne[0])
          }
        }
        enqueueSnackbar('データがありません ', { variant: 'info' })
        return
      }
    } else {
      Get().then()
      enqueueSnackbar('Info情報の更新: ' + tmpData.lastUpdated, {
        variant: 'info',
      })
    }
    ref.current?.scrollIntoView()
  }, [infos])

  useEffect(() => {
    if (lastMessage !== null) {
      const obj = JSON.parse(lastMessage?.data)

      if (ticket?.chat != null) {
        setTicket({
          ...ticket,
          chat: [
            ...ticket.chat,
            {
              ticket_id: Number(id),
              admin: obj.admin,
              data: obj.message,
              created_at: obj.time,
              user_id: obj.user_id,
              user_name: obj.username,
            },
          ],
        })
      }
      const tmpData = infos[infos.length - 1]
      if (obj.user_id === tmpData.data?.user?.id) {
        enqueueSnackbar('送信しました', { variant: 'success' })
      } else {
        enqueueSnackbar('新規メッセージがあります', { variant: 'success' })
      }
      ref.current?.scrollIntoView()
    }
  }, [lastMessage])

  useEffect(() => {
    if (sendPush) {
      sendMessage(
        JSON.stringify({
          access_token: Cookies.get('access_token'),
          user_token: Cookies.get('user_token'),
          message: inputChatData,
        })
      )
      setSendPush(false)
    }
  }, [sendPush])

  const getUser = (id: number) => {
    const result = userList?.filter((user) => user.id === id)
    if (result === undefined) {
      return '不明'
    }
    return result[0].name
  }

  return (
    <>
      {id === undefined && (
        <DashboardComponent>
          <h2>IDの値が取得できません</h2>
        </DashboardComponent>
      )}
      {ticket?.chat === undefined && (
        <DashboardComponent>
          <h2>データがありません</h2>
        </DashboardComponent>
      )}
      {ticket?.chat != null && (
        <DashboardComponent
          title={ticket?.id + ': ' + ticket?.title}
          sx={{ padding: '2px' }}
          forceDrawerClosed={true}
        >
          <StyledPaperMessage id="style-1">
            <b>このチャットはMarkdownに準拠しております。</b>
            {ticket.chat.map((chat, index) =>
              !chat.admin ? (
                <MessageRight
                  key={index}
                  message={chat.data}
                  timestamp={chat.created_at}
                  displayName={getUser(chat.user_id)}
                />
              ) : (
                <MessageLeft
                  key={index}
                  message={chat.data}
                  timestamp={chat.created_at}
                  displayName={'運営'}
                />
              )
            )}
            <div ref={ref} />
          </StyledPaperMessage>
          <TextInput
            key={'textInput'}
            inputChat={inputChatData}
            setInputChat={setInputChatData}
            setSendPush={setSendPush}
          />
        </DashboardComponent>
      )}
    </>
  )
}
