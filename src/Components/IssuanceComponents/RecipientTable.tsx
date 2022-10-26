import React from 'react'
import classNames from "classnames/bind";
import styles from '../../Style/IssuanceTable.module.css'

const cs = classNames.bind(styles)

const RecipientTable = () => {
  return (
    <div className={cs('recipient-table')}>
      <table>
        <thead>
        <tr>
          <th>학년</th>
          <th>반</th>
          <th>번호</th>
          <th>이름</th>
          <th>구분</th>
          <th>점수항목</th>
          <th>메모</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default RecipientTable