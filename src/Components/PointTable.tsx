import React from "react";
import classNames from "classnames/bind";
import styles from '../Style/Timeline.module.css'

const cs = classNames.bind(styles)

const PointTable = () => {
  const data = [
    {
      'division': '성희롱',
      'point': 10,
      'accumulate': 10,
      'issuer': '김진효',
      'date': '2022-10-10'
    },
    {
      'division': '성희롱',
      'point': 10,
      'accumulate': 10,
      'issuer': '김진효',
      'date': '2022-10-10'
    },
    {
      'division': '성희롱',
      'point': 10,
      'accumulate': 10,
      'issuer': '김진효',
      'date': '2022-10-10'
    },
    {
      'division': '성희롱',
      'point': 10,
      'accumulate': 10,
      'issuer': '김진효',
      'date': '2022-10-10'
    },
    {
      'division': '전국대회 수상',
      'point': -10,
      'accumulate': 10,
      'issuer': '김진효',
      'date': '2022-10-10'
    }
  ]

  return (
    <div className={cs('point-table')}>
      <table>
        <thead>
        <tr>
          <th style={{borderTopLeftRadius: '10px'}}>발급 항목</th>
          <th>점수</th>
          <th>누계</th>
          <th>발급자</th>
          <th style={{borderTopRightRadius: '10px'}}>발급일</th>
        </tr>
        </thead>
        <tbody>
        {Object.values(data).map((log: any, index: number) => (
          <tr key={index} className={cs('tbody-tr')}>
            <td className={cs('division-tag', 'tbody-td')}>&nbsp;{log.division}&nbsp;</td>
            <td style={{color: log.point < 0 ? '#ce2c2c' : '#04ad04', fontWeight: 'bold'}}
                className={cs('span-align', 'tbody-td')}>{log.point}점
            </td>
            <td style={{color: '#2951c7', fontWeight: 'bold'}}
                className={cs('span-align', 'tbody-td')}>{log.accumulate}점
            </td>
            <td className={cs('span-align', 'tbody-td')}>{log.issuer}</td>
            <td className={cs('span-align', 'tbody-td')}>{log.date}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default PointTable