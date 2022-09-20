import React, { useState } from 'react';
import useSWR from 'swr'
import fetcher from "../utils/fetcher";
import Loading from "../Components/Loading";

const RuleTable = () => {
  const { data, error } = useSWR('http://localhost:3001/table/regulate', fetcher)

  let bonusPoint: Array<any> = []
  let minusPoint: Array<any> = []

  if (error) {
    return <div>ERROR</div>
  } else if (!data) {
    return <Loading/>
  } else {
    const keyData = data.isTable

    for (let i = 0; i < keyData.length; i++) {
      if (keyData[i].point === '상점') {
        bonusPoint.push(keyData[i])
      } else {
        minusPoint.push(keyData[i])
      }
    }

    return (
      <div>
        <div>
        <div>벌점 규정</div>
        <table>
          <thead>
          <tr>
            <th style={{ width: '90px' }}>구분</th>
            <th>항</th>
            <th>적용내용</th>
            <th>점수</th>
          </tr>
          </thead>
          <tbody>
          {Object.values(minusPoint).map((log: any, index: number) => (
            <tr key={index}>
              <td>{log.division}</td>
              <td>{log.paragraph}</td>
              <td>{log.contents}</td>
              <td>{log.score}</td>
            </tr>
          ))}
          </tbody>
        </table>
        </div>

        <br/>
        <div>
          <div>상점 규정</div>
          <table>
            <thead>
            <tr>
              <th>구분</th>
              <th>항</th>
              <th>적용내용</th>
              <th>점수</th>
            </tr>
            </thead>
            <tbody>
            {Object.values(bonusPoint).map((log: any, index: number) => (
              <tr key={index}>
                <td>{log.division}</td>
                <td>{log.paragraph}</td>
                <td>{log.contents}</td>
                <td>{log.score}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div>규정 테이블</div>
  )
}

export default RuleTable