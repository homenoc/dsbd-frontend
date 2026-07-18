import { isActive, isPaidMemberType } from '@dsbd/shared';
import { Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardComponent from '../../components/Dashboard/Dashboard';
import { useCatalog } from '../../hooks/useCatalog';
import { useInfo } from '../../hooks/useInfo';
import type { InfoData } from '../../interface';
import { StyledCardHeader1, StyledDivCardPricing } from './styles';
import './payment.scss';
import { api } from '../../lib/api';
import { restfulApiConfig } from '../../lib/config';
import { StyledContainer1 } from '../../style';

export default function Payment() {
  const [data, setData] = React.useState<InfoData>();
  const { data: infoData, error } = useInfo();
  const { data: template } = useCatalog();
  const navigate = useNavigate();
  const [isStatus, setIsStatus] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // 401 is handled centrally by the shared API client (redirect to /login).
  useEffect(() => {
    if (infoData == null) return;
    if (!isActive(infoData.group?.expired_status)) {
      navigate('/dashboard');
    }
    setData(infoData);

    if (infoData.user?.group_id == null) {
      setIsStatus(1);
    } else if (!isPaidMemberType(infoData.group?.member_type_id ?? 0)) {
      setIsStatus(2);
    } else if (infoData.info?.length == null) {
      setIsStatus(3);
    } else if (infoData.group?.is_stripe_id && infoData.group?.is_expired) {
      setIsStatus(4);
    } else if (!infoData.group?.is_expired) {
      setIsStatus(5);
    }
  }, [infoData, navigate]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar((error as Error).message, { variant: 'error' });
    }
  }, [error, enqueueSnackbar]);

  const subscribeMutation = useMutation({
    mutationFn: (plan: string) =>
      api.post<{ url: string }>('/payment/subscribe', { plan }).then((r) => r.url),
    onSuccess: (url: string) => {
      window.open(url, '_blank');
    },
    onError: (e: Error) => {
      enqueueSnackbar(String(e.message), { variant: 'error' });
    },
  });

  const subscribe = (plan: string) => {
    subscribeMutation.mutate(plan);
  };

  // On-demand read: the payment portal URL is fetched only when the user
  // clicks (enabled: false), then opened in a new tab.
  const paymentQuery = useQuery({
    queryKey: ['payment'],
    queryFn: () => api.get<{ url: string }>('/payment').then((r) => r.url),
    enabled: false,
  });

  const getPayment = async () => {
    const result = await paymentQuery.refetch();
    const url = result.data as string | undefined;
    if (url != null) {
      window.open(url, '_blank');
    } else if (result.error) {
      enqueueSnackbar(String((result.error as Error).message), { variant: 'error' });
    }
  };

  const DonatePage = () => {
    window.open(restfulApiConfig.donateURL, '_blank');
  };

  return (
    <DashboardComponent title="Payment">
      <StyledContainer1 maxWidth="sm">
        {/*<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>*/}
        {/*    Payment*/}
        {/*</Typography>*/}
        <Typography variant="h5" align="center" color="textSecondary" component="p">
          当団体ではネットワーク接続などをご利用頂いている皆様に「会費」として運営費用の一部を負担して頂くことになりました。
          {/*今後も継続して活動を続けていくために、運営費用の一部を利用者の皆様に負担していただく予定です。*/}
        </Typography>
      </StyledContainer1>
      {data?.group?.coupon_id !== '' && <h2>クーポンID：{data?.group?.coupon_id}</h2>}
      {isStatus === 1 && <h2>グループ未登録のため、この操作は出来ません。</h2>}
      {isStatus === 2 && <h2>{data?.group?.member_type}のため、費用は免除されます。</h2>}
      {isStatus === 3 && <h2>開通処理後、会費の支払いを行ってください。</h2>}
      {isStatus === 4 && (
        <div>
          <h3>期限切れ</h3>
          <p>以下の「支払い履歴/情報/プラン変更」から支払い状況を確認してください</p>
          <p>ご不明な場合などがありましたら、Supportチャットにてご連絡のほどお願いいたします。</p>
          <Button variant={'contained'} color="primary" onClick={getPayment}>
            支払い履歴/情報/プラン変更
          </Button>
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>有効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}</h3>
          )}
        </div>
      )}
      {isStatus === 5 && (
        <div>
          <h3>
            定期支払いを解約する場合は、解約になりますので、「各種手続き ⇛
            退会手続き」をお選びください。
          </h3>
          <br />
          <h2>支払い済みです。</h2>
          <Button variant={'contained'} color="primary" onClick={getPayment}>
            支払い履歴/情報/プラン変更
          </Button>
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>有効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}</h3>
          )}
        </div>
      )}
      {isStatus === 0 && (
        <Container maxWidth="md" component="main">
          <h3>会員種別: {data?.group?.member_type}</h3>
          {data?.group?.member_expired != null && (
            <h3>失効期限: {data?.group?.member_expired.split('T')[0] ?? '---'}</h3>
          )}
          <h3>支払いを行うと自動定期支払いになりますので、ご注意ください。</h3>
          <Grid container spacing={5} alignItems="flex-end">
            {template?.payment_membership?.map((membership, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card>
                  <StyledCardHeader1
                    title={membership.title}
                    // subheader={tier.subheader}
                    titleTypographyProps={{ align: 'center' }}
                    subheaderTypographyProps={{ align: 'center' }}
                    // action={tier.title === 'Pro' ? <StarIcon/> : null}
                  />
                  <CardContent>
                    <StyledDivCardPricing>
                      <Typography component="h2" variant="h3" color="textPrimary">
                        {membership.fee}円
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        /{membership.plan}
                      </Typography>
                    </StyledDivCardPricing>
                    <ul>{/*{membership.comment}*/}</ul>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => subscribe(membership.plan)}
                    >
                      支払う
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <p>失効期限は自動更新時に期限更新されます</p>
        </Container>
      )}
      <br />
      <br />
      <Container>
        <h3>寄付をしてくださる方はこちらからお願いいたします。</h3>
        <Button variant={'contained'} color="primary" onClick={DonatePage}>
          寄付をご希望の方はこちらから
        </Button>
      </Container>

      <h5>決済システムとして、stripeを使用しております。</h5>
    </DashboardComponent>
  );
}
