import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import DashboardComponent from '../../../components/Dashboard/Dashboard';
import { useSupportTicket } from '../../../hooks/useResources';
import type { TicketDetailData, UserDetailData } from '../../../interface';
import { restfulApiConfig } from '../../../lib/config';
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
      sessionStorage.getItem('ClientID') +
      '&access_token=' +
      sessionStorage.getItem('AccessToken'),
    {
      onOpen: () => enqueueSnackbar('WebSocket接続確立', { variant: 'success' }),
      onClose: () => enqueueSnackbar('WebSocket切断', { variant: 'error' }),
      shouldReconnect: () => true,
    },
  );
  const { enqueueSnackbar } = useSnackbar();
  // The ticket lives in local state because the websocket appends chat entries
  // to it; the query only seeds it.
  const [ticket, setTicket] = useState<TicketDetailData>();
  const [inputChatData, setInputChatData] = useState('');
  const [sendPush, setSendPush] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: ticketData, error: ticketError } = useSupportTicket(Number(id));

  useEffect(() => {
    if (ticketData) {
      setTicket(ticketData);
      ref.current?.scrollIntoView();
    }
  }, [ticketData]);

  useEffect(() => {
    if (ticketError) {
      enqueueSnackbar(String((ticketError as Error).message), { variant: 'error' });
    }
  }, [ticketError]);

  useEffect(() => {
    if (lastMessage !== null) {
      const obj = JSON.parse(lastMessage?.data);
      const user: UserDetailData = {
        CreatedAt: '',
        ID: 0,
        UpdatedAt: '',
        email: '',
        expired_status: 0,
        group_id: 0,
        level: 0,
        mail_token: '',
        mail_verify: true,
        name: obj.username,
        name_en: '',
        pass: '',
      };
      if (ticket?.chat != null) {
        setTicket({
          ...ticket,
          chat: [
            ...ticket.chat,
            {
              CreatedAt: obj.time,
              ID: 0,
              UpdatedAt: obj.time,
              admin: obj.admin,
              data: obj.message,
              user_id: obj.user_id,
              user,
            },
          ],
        });
      }
      if (obj.admin) {
        enqueueSnackbar('送信しました。', { variant: 'success' });
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
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken')!,
          message: inputChatData,
        }),
      );
      setSendPush(false);
    }
  }, [sendPush]);

  return (
    <>
      {ticket?.chat === undefined && (
        <DashboardComponent>
          <h2>データがありません</h2>
        </DashboardComponent>
      )}
      {ticket?.chat != null && (
        <DashboardComponent
          title={id + ': ' + ticket?.title}
          sx={{ padding: '7px' }}
          forceDrawerClosed={true}
        >
          <StyledPaperMessage id="style-1">
            <b>このチャットはMarkdownに準拠しております。</b>
            {ticket?.chat.map((chat, index) =>
              chat.admin ? (
                <MessageRight key={index} message={chat.data} timestamp={chat.CreatedAt} />
              ) : (
                <MessageLeft
                  key={index}
                  message={chat.data}
                  timestamp={chat.CreatedAt}
                  displayName={chat.user?.name}
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
