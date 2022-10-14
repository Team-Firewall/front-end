import React, { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Loading from "./Loading";
import classNames from "classnames/bind";
import styles from '../Style/Timeline.module.css'
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";

const cs = classNames.bind(styles)

const PointTable = () => {
  const [id, setId] = useState<number>()

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setId(decodeToken.userid)
  }, [])

  const {data, error} = useSWR(`http://localhost:8889/getUserPoint?id=${id}`, fetcher)

  if (error) {
    return <div>Error</div>
  } else if (!data) {
    return <Loading/>
  } else {
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
}

export default PointTable