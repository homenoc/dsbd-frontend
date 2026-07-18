import { IP, JPNICData, ServiceData } from '../../../interface'
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import React from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import cssModule from './ServiceList.module.scss'
import {
  StyledCardRoot2,
  StyledCardRoot3,
  StyledTableRowRoot,
} from '../../../style'

export function ServiceGet(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <div className={cssModule.contract}>
          <ServiceEtc key={'service_etc'} service={service} />
        </div>
      </Grid>
      <Grid item xs={6}>
        <ServiceIP key={'service_ip'} service={service} />
      </Grid>
      <Grid item xs={12}>
        <ServiceJPNIC key={'service_jpnic'} service={service} />
      </Grid>
      <Grid item xs={6}>
        <ServiceJPNICAdmin key={'service_jpnic_admin'} service={service} />
      </Grid>
      <Grid item xs={6}>
        <ServiceJPNICTech key={'service_jpnic_tech'} service={service} />
      </Grid>
    </Grid>
  )
}

function ServiceEtc(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <StyledCardRoot3>
      <CardContent>
        <h3>Bandwidth</h3>
        <table aria-colspan={3}>
          <thead>
            <tr>
              <th colSpan={1} />
              <th colSpan={1}>上り</th>
              <th colSpan={1}>下り</th>
            </tr>
            <tr>
              <th>最大</th>
              <td>{service.max_upstream}Mbps</td>
              <td>{service.max_downstream}Mbps</td>
            </tr>
            <tr>
              <th>平均</th>
              <td>{service.avg_upstream}Mbps</td>
              <td>{service.avg_downstream}Mbps</td>
            </tr>
          </thead>
        </table>
        <br />
        <table aria-colspan={2}>
          <thead>
            <tr>
              <th colSpan={2}>大量に通信する可能性のあるAS</th>
            </tr>
            <tr>
              <th>AS</th>
              <td>{service.max_bandwidth_as}</td>
            </tr>
          </thead>
        </table>
      </CardContent>
    </StyledCardRoot3>
  )
}

function ServiceIP(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <div>
      {service.ip === undefined && (
        <Card>
          <CardContent>
            <h3>IP</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.ip != null && (
        <StyledCardRoot2>
          <CardContent>
            <h3>IP</h3>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>ID</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">IP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {service.ip?.map((row, index) => (
                    <ServiceIPRow key={'service_ip_row_' + index} ip={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </StyledCardRoot2>
      )}
    </div>
  )
}

function ServiceIPRow(props: { ip: IP }): any {
  const { ip } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <StyledTableRowRoot>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {ip.id}
        </TableCell>
        <TableCell align="left">{ip.name}</TableCell>
        <TableCell align="left">{ip.ip}</TableCell>
      </StyledTableRowRoot>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>直後</TableCell>
                    <TableCell>半年後</TableCell>
                    <TableCell>1年後</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ip.plan === undefined && (
                    <p>
                      <b>情報なし</b>
                    </p>
                  )}
                  {ip.plan != null &&
                    ip.plan?.map((plan, index) => (
                      <StyledTableRowRoot key={'service_table_row_' + index}>
                        <TableCell component="th" scope="row">
                          {plan.id}
                        </TableCell>
                        <TableCell align="left">{plan.name}</TableCell>
                        <TableCell align="right">{plan.after}</TableCell>
                        <TableCell align="right">{plan.half_year}</TableCell>
                        <TableCell align="right">{plan.one_year}</TableCell>
                      </StyledTableRowRoot>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export function ServiceJPNIC(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <div>
      {!service.need_jpnic && (
        <Card>
          <CardContent>
            <h3>JPNIC記入情報</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.need_jpnic && (
        <Card className={cssModule.contract}>
          <CardContent>
            <h3>JPNIC記入情報</h3>
            <table aria-colspan={3}>
              <thead>
                <tr>
                  <th colSpan={1} />
                  <th colSpan={1}>Japanese</th>
                  <th colSpan={1}>English</th>
                </tr>
                <tr>
                  <th>団体名</th>
                  <td>{service.org}</td>
                  <td>{service.org_en}</td>
                </tr>
                <tr>
                  <th>郵便番号</th>
                  <td colSpan={2}>{service.postcode}</td>
                </tr>
                <tr>
                  <th>住所</th>
                  <td>{service.address}</td>
                  <td>{service.address_en}</td>
                </tr>
              </thead>
            </table>
            <br />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function ServiceJPNICAdmin(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <div>
      {!service.need_jpnic && (
        <Card>
          <CardContent>
            <h3>JPNIC管理者連絡窓口記入情報</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.need_jpnic && service.jpnic_admin === undefined && (
        <Card>
          <CardContent>
            <h3>JPNIC管理者連絡窓口記入情報</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.need_jpnic && service.jpnic_admin != null && (
        <Card className={cssModule.contract}>
          <CardContent>
            <h3>JPNIC管理者連絡窓口記入情報</h3>
            <table aria-colspan={3}>
              <thead>
                <tr>
                  <th colSpan={1} />
                  <th colSpan={1}>Japanese</th>
                  <th colSpan={1}>English</th>
                </tr>
                <tr>
                  <th>JPNIC Handle</th>
                  <td colSpan={2}>{service.jpnic_admin.jpnic_handle}</td>
                </tr>
                <tr>
                  <th>Org</th>
                  <td>{service.jpnic_admin.org}</td>
                  <td>{service.jpnic_admin.org_en}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{service.jpnic_admin.name}</td>
                  <td>{service.jpnic_admin.name_en}</td>
                </tr>
                <tr>
                  <th>郵便番号</th>
                  <td colSpan={2}>{service.jpnic_admin.postcode}</td>
                </tr>
                <tr>
                  <th>住所</th>
                  <td>{service.jpnic_admin.address}</td>
                  <td>{service.jpnic_admin.address_en}</td>
                </tr>
                <tr>
                  <th>Dept</th>
                  <td>{service.jpnic_admin.dept}</td>
                  <td>{service.jpnic_admin.dept_en}</td>
                </tr>
                <tr>
                  <th>Tel</th>
                  <td colSpan={2}>{service.jpnic_admin.tel}</td>
                </tr>
                <tr>
                  <th>Fax</th>
                  <td colSpan={2}>{service.jpnic_admin.fax}</td>
                </tr>
                <tr>
                  <th>Mail</th>
                  <td colSpan={2}>{service.jpnic_admin.mail}</td>
                </tr>
                <tr>
                  <th>住居国</th>
                  <td colSpan={2}>{service.jpnic_admin.country}</td>
                </tr>
              </thead>
            </table>
            <br />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function ServiceJPNICTech(props: { service: ServiceData }): any {
  const { service } = props

  return (
    <div>
      {!service.need_jpnic && (
        <Card>
          <CardContent>
            <h3>JPNIC技術連絡担当者</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.need_jpnic && service.jpnic_tech == null && (
        <Card>
          <CardContent>
            <h3>JPNIC技術連絡担当者</h3>
            <p>
              <b>情報なし</b>
            </p>
          </CardContent>
        </Card>
      )}
      {service.need_jpnic && service.jpnic_tech !== null && (
        <StyledCardRoot2>
          <CardContent>
            <h3>JPNIC技術連絡担当者</h3>
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
                  {service.jpnic_tech?.map((row, index) => (
                    <ServiceJPNICTechRow
                      key={'service_jpnic_tech_row_' + index}
                      jpnic={row}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </StyledCardRoot2>
      )}
    </div>
  )
}

function ServiceJPNICTechRow(props: { jpnic: JPNICData }): any {
  const { jpnic } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <StyledTableRowRoot>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {jpnic.id}
        </TableCell>
        <TableCell align="right">{jpnic.name}</TableCell>
        <TableCell align="right">{jpnic.mail}</TableCell>
      </StyledTableRowRoot>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} className={cssModule.contract}>
              <table aria-colspan={3}>
                <thead>
                  <tr>
                    <th colSpan={1} />
                    <th colSpan={1}>Japanese</th>
                    <th colSpan={1}>English</th>
                  </tr>
                  <tr>
                    <th>JPNIC Handle</th>
                    <td colSpan={2}>{jpnic.jpnic_handle}</td>
                  </tr>
                  <tr>
                    <th>Org</th>
                    <td>{jpnic.org}</td>
                    <td>{jpnic.org_en}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{jpnic.name}</td>
                    <td>{jpnic.name_en}</td>
                  </tr>
                  <tr>
                    <th>郵便番号</th>
                    <td colSpan={2}>{jpnic.postcode}</td>
                  </tr>
                  <tr>
                    <th>住所</th>
                    <td>{jpnic.address}</td>
                    <td>{jpnic.address_en}</td>
                  </tr>
                  <tr>
                    <th>Dept</th>
                    <td>{jpnic.dept}</td>
                    <td>{jpnic.dept_en}</td>
                  </tr>
                  <tr>
                    <th>Tel</th>
                    <td colSpan={2}>{jpnic.tel}</td>
                  </tr>
                  <tr>
                    <th>Fax</th>
                    <td colSpan={2}>{jpnic.fax}</td>
                  </tr>
                  <tr>
                    <th>Mail</th>
                    <td colSpan={2}>{jpnic.mail}</td>
                  </tr>
                  <tr>
                    <th>住居国</th>
                    <td colSpan={2}>{jpnic.country}</td>
                  </tr>
                </thead>
              </table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
