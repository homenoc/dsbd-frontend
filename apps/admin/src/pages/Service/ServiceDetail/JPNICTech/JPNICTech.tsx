import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import { JPNICDetail, JPNICTechAdd } from '../../../../components/Dashboard/JPNIC/JPNIC';
import type { JPNICData } from '../../../../interface';
import { StyledCardRoot2, StyledTableRowRoot } from '../../../../style';

export function ServiceJPNICTechBase(props: {
  serviceID: number;
  jpnicAdmin: JPNICData | undefined;
  jpnicTech: JPNICData[] | undefined;
}) {
  const { jpnicAdmin, jpnicTech, serviceID } = props;

  if (jpnicTech === undefined) {
    return (
      <Card>
        <CardContent>
          <h3>JPNIC技術連絡担当者</h3>
          <p>
            <b>情報なし</b>
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <ServiceJPNICTech
      key={serviceID}
      serviceID={serviceID}
      jpnicAdmin={jpnicAdmin}
      jpnicTech={jpnicTech}
    />
  );
}

export function ServiceJPNICTech(props: {
  serviceID: number;
  jpnicAdmin: JPNICData | undefined;
  jpnicTech: JPNICData[];
}) {
  const { jpnicAdmin, jpnicTech, serviceID } = props;

  return (
    <StyledCardRoot2>
      <CardContent>
        <h3>JPNIC技術連絡担当者</h3>
        <JPNICTechAdd key={'jpnic_tech_add'} serviceID={serviceID} jpnicAdmin={jpnicAdmin} />
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Mail</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jpnicTech.map((row) => (
                <ServiceJPNICTechRow
                  key={'service_jpnic_tech_row_' + row.ID}
                  serviceID={serviceID}
                  jpnic={row}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </StyledCardRoot2>
  );
}

export function ServiceJPNICTechRow(props: {
  serviceID: number;
  jpnic: JPNICData;
}) {
  const { jpnic, serviceID } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <StyledTableRowRoot>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {jpnic.ID}
        </TableCell>
        <TableCell align="right">{jpnic.name}</TableCell>
        <TableCell align="right">{jpnic.mail}</TableCell>
      </StyledTableRowRoot>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <JPNICDetail
                key={'jpnic_tech_detail_' + serviceID}
                jpnicAdmin={false}
                serviceID={serviceID}
                jpnic={jpnic}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
