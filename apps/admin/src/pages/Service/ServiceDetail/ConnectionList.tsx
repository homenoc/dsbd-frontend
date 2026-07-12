import { Card, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import type { ServiceDetailData } from '../../../interface';
import { RowConnection } from '../../Group/GroupDetail/Connection';

export function ConnectionList(props: { service: ServiceDetailData }) {
  const { service } = props;
  return (
    <Card>
      <Typography variant="h6" gutterBottom component="div">
        Connection
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Service Code</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Tag</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <RowConnection key={'table_connection'} service={service} />
      </Table>
    </Card>
  );
}
