import { GroupData } from '../../../interface'
import React from 'react'
import classesCSS from './style.module.scss'

export function GroupGet(props: { group: GroupData }): any {
  const { group } = props

  return (
    <div className={classesCSS.contract}>
      <br />
      <table aria-colspan={3}>
        <thead>
          <tr>
            <th colSpan={1} />
            <th colSpan={1}>Japanese</th>
            <th colSpan={1}>English</th>
          </tr>
          <tr>
            <th>Org</th>
            <td>{group.org}</td>
            <td>{group.org_en}</td>
          </tr>
          <tr>
            <th>郵便番号</th>
            <td colSpan={2}>{group.postcode}</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>{group.address}</td>
            <td>{group.address_en}</td>
          </tr>
          <tr>
            <th>Tel</th>
            <td colSpan={2}>{group.tel}</td>
          </tr>
        </thead>
      </table>
    </div>
  )
}
