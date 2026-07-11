import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { restfulApiConfig } from '../../../api/Config';
import DashboardComponent from '../../../components/Dashboard/Dashboard';
import { useInfo } from '../../../hooks/useInfo';
import type { TicketData, UserData } from '../../../interface';
import { StyledPaperMessage } from '../styles';
import { MessageLeft, MessageRight } from './Message';
import { TextInput } from './TextInput';

export default function SupportDetail() {
  const { id } = useParams();
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
      onOpen: () => enqueueSnackbar('WebSocket接続確立', { variant: 'success' }),
      onClose: () => enqueueSnackbar('WebSocket切断', { variant: 'error' }),
      shouldReconnect: () => true,
    },
  );
  const { enqueueSnackbar } = useSnackbar();
  const [inputChatData, setInputChatData] = useState('');
  const [ticket, setTicket] = useState<TicketData>();
  const [userList, setUserList] = useState<UserData[]>();
  const { data: infoData, error } = useInfo();
  const [sendPush, setSendPush] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [ticket]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData == null) return;
    if (infoData.user_list != null) {
      setUserList(infoData.user_list);
    }
    if (infoData.ticket != null) {
      const ticketOne = infoData.ticket.filter((ticket: TicketData) => ticket.id === Number(id));
      if (ticketOne.length !== 0) {
        setTicket(ticketOne[0]);
      }
    }
    if (infoData.request != null) {
      const requestOne = infoData.request.filter((ticket: TicketData) => ticket.id === Number(id));
      if (requestOne.length !== 0) {
        setTicket(requestOne[0]);
      }
    }
    ref.current?.scrollIntoView();
  }, [infoData, id]);

  useEffect(() => {
    if (lastMessage !== null) {
      const obj = JSON.parse(lastMessage?.data);

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
        });
      }
      if (obj.user_id === infoData?.user?.id) {
        enqueueSnackbar('送信しました', { variant: 'success' });
      } else {
        enqueueSnackbar('新規メッセージがあります', { variant: 'success' });
      }
      ref.current?.scrollIntoView();
    }
  }, [lastMessage]);

  useEffect(() => {
    if (sendPush) {
      sendMessage(
        JSON.stringify({
          access_token: Cookies.get('access_token'),
          user_token: Cookies.get('user_token'),
          message: inputChatData,
        }),
      );
      setSendPush(false);
    }
  }, [sendPush]);

  const getUser = (id: number) => {
    const result = userList?.filter((user) => user.id === id);
    if (result === undefined) {
      return '不明';
    }
    return result[0].name;
  };

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
              ),
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
  );
}
