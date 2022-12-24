import React from "react";
import classNames from "classnames/bind";
import styles from '../Style/Timeline.module.css'

const cs = classNames.bind(styles)

const PointTable = (props: any) => {

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
          {Object.values(props.data).map((log: any, index: number) => (
            <tr key={index} className={cs('tbody-tr')}>
              <td className={cs('division-tag', 'tbody-td')}>&nbsp;{log.regulate}&nbsp;</td>
              <td style={{color: log.score < 0 ? '#ce2c2c' : '#04ad04', fontWeight: 'bold'}}
                  className={cs('span-align', 'tbody-td')}>{log.score}점
              </td>
              <td style={{color: '#2951c7', fontWeight: 'bold'}}
                  className={cs('span-align', 'tbody-td')}>점
              </td>
              <td className={cs('span-align', 'tbody-td')}>{log.issuer}</td>
              <td className={cs('span-align', 'tbody-td')}>{log.createdDate}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
}

export default PointTable