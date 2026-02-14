import { InfosData } from '../../../interface'
import React from 'react'
import classesCSS from './style.module.scss'

export function InfoGet(props: { info: InfosData }): any {
  const { info } = props

  return (
    <div className={classesCSS.contract}>
      <br />
      <table aria-colspan={2}>
        <thead>
          <tr>
            <th colSpan={2}>IP</th>
          </tr>
          <tr>
            <th>IP Version</th>
            <th>Address</th>
          </tr>
          {info.v4?.map((v4,index) => (
            <tr key={'v4_' + index}>
              <td>IPv4</td>
              <td>{v4}</td>
            </tr>
          ))}
          {info.v6?.map((v6, index) => (
            <tr key={'v6_' + index}>
              <td>IPv6</td>
              <td>{v6}</td>
            </tr>
          ))}
        </thead>
      </table>
      <br />
      <table aria-colspan={2}>
        <thead>
          <tr>
            <th colSpan={2}>内容</th>
          </tr>
          <tr>
            <th>サービス種別</th>
            <td>{info.service}</td>
          </tr>
          <tr>
            <th>利用料金</th>
            <td>{info.fee}</td>
          </tr>
          <tr>
            <th>当団体からのIPアドレスの割当</th>
            {info.assign && <td>当団体から割当</td>}
            {!info.assign && <td>貴団体から割当</td>}
          </tr>
        </thead>
      </table>
      <br />
      <table className={classesCSS.contract}>
        <thead>
          <tr>
            <th colSpan={3}>接続情報</th>
          </tr>
          <tr>
            <th>接続方式</th>
            <td colSpan={2}>{info.service}</td>
          </tr>
          <tr>
            <th>接続NOC</th>
            <td colSpan={2}>{info.noc}</td>
          </tr>
          <tr>
            <th>トンネル終端アドレス（貴団体側）</th>
            <td colSpan={2}>{info.term_ip}</td>
          </tr>
          <tr>
            <th>トンネル終端アドレス（HomeNOC側）</th>
            <td colSpan={2}>{info.noc_ip}</td>
          </tr>
          <tr>
            <th>RFC8950利用</th>
            <td colSpan={2}>{info.rfc8950 ? 'あり' : 'なし'}</td>
          </tr>
          <tr>
            <th colSpan={3}>当団体との間の境界アドレス</th>
          </tr>
          <tr>
            <th />
            <th>IPv4アドレス</th>
            <th>IPv6アドレス</th>
          </tr>
          <tr>
            <th>HomeNOC側</th>
            <td>{info.rfc8950 ? 'RFC8950利用のため無し' : info.link_v4_our}</td>
            <td>{info.link_v6_our}</td>
          </tr>
          <tr>
            <th>貴団体側</th>
            <td>{info.rfc8950 ? 'RFC8950利用のため無し' : info.link_v4_your}</td>
            <td>{info.link_v6_your}</td>
          </tr>
        </thead>
      </table>
    </div>
  )
}
