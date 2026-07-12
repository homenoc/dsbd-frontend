import { Card, CardContent } from '@mui/material';
import React from 'react';
import { JPNICDetail } from '../../../../components/Dashboard/JPNIC/JPNIC';
import type { JPNICData } from '../../../../interface';
import cssModule from '../../../Connection/ConnectionDetail/ConnectionDialog.module.scss';

export function ServiceJPNICAdminBase(props: {
  serviceID: number;
  jpnic: JPNICData | undefined;
}) {
  const { jpnic, serviceID } = props;

  if (jpnic === undefined) {
    return (
      <Card>
        <CardContent>
          <h3>JPNIC管理者連絡窓口</h3>
          <p>
            <b>情報なし</b>
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={cssModule.contract}>
      <CardContent>
        <h3>JPNIC管理者連絡窓口</h3>
        <JPNICDetail key={serviceID} jpnicAdmin={true} serviceID={serviceID} jpnic={jpnic} />
      </CardContent>
    </Card>
  );
}
