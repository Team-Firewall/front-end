import React from "react";
import classNames from "classnames/bind";
import styles from '../Style/Timeline.module.css'
import LinesEllipsis from "react-lines-ellipsis";

const cs = classNames.bind(styles)

const PointTable = (props: any) => {
  const year = new Date().getFullYear()
  return (
    <>
      <div className={'management-table-container'} style={{height: '70vh'}}>
        <table>
          <thead>
          <tr>
            <th style={{borderTopLeftRadius: '4px', width: '55%'}}>발급 항목</th>
            <th style={{width: '15%'}}>사유</th>
            <th style={{width: '10%'}}>발급자</th>
            <th style={{width: '10%'}}>발급일</th>
            <th style={{width: '5%'}}>점수</th>
            <th style={{borderTopRightRadius: '4px', width: '5%'}}>누계</th>
          </tr>
          </thead>

          <tbody>
          {Object.values(props.data).map((log: any, index: number) => (
            <tr key={index}>
              <td style={{paddingLeft: '1rem', paddingRight: '1rem', textAlign: 'left'}}>
                <LinesEllipsis
                  text={log.regulate}
                  maxLine='1'
                  ellipsis='...'
                  trimRight
                  basedOn='letters'
                />
              </td>

              <td>
                <LinesEllipsis
                  text={log.reason}
                  maxLine='1'
                  ellipsis='...'
                  trimRight
                  basedOn='letters'
                />
              </td>

              <td>{log.issuer}</td>
              <td>{log.createdAt}</td>
              <td style={{color: log.score < 0 ? '#e54141' : '#40b06e'}}>{log.score}점</td>
              <td style={{color: '#4a7dd9'}}>{log.total}점</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <div className={cs('total-value')}>
        <table>
          <tr>
            <td colSpan={3} style={{ width: '70%' }}>{year}년 누계 점수</td>
            <td style={{ width: '10%' }}><span style={{ color: '#40b06e' }}>상점</span> {props.totalData.bonus}점</td>
            <td style={{ width: '10%' }}><span style={{ color: '#e54141' }}>벌점</span> {props.totalData.minus}점</td>
            <td style={{ width: '10%' }}><span style={{ color: '#4a7dd9' }}>총계</span> {props.totalData.total}점</td>
          </tr>
        </table>
      </div>
    </>
  )
}

export default PointTable