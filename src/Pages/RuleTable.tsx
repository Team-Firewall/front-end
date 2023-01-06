import React from 'react';
import useSWR from 'swr'
import fetcher from "../utils/fetcher";
import Loading from "../Components/Loading";
import classNames from "classnames/bind";
import style from '../Style/RuleTable.module.css'
import { AiOutlineHome } from 'react-icons/ai'
import { useNavigate } from "react-router-dom";

const cs = classNames.bind(style)

const RuleTable = () => {
  const navigate = useNavigate()
  const {data, error} = useSWR(`${process.env.REACT_APP_API_URL}/v1/regulate`, fetcher)

  console.log(data)
  let bonusPoint: Array<any> = []
  let minusPoint: Array<any> = []

  if (error) {
    return <div>ERROR</div>
  } else if (!data) {
    return <Loading/>
  } else {
    const keyData = data

    for (let i = 0; i < keyData.length; i++) {
      if (keyData[i].checked === '상점') {
        bonusPoint.push(keyData[i])
      } else {
        minusPoint.push(keyData[i])
      }
    }

    return (
      <div className={cs('rule-table')}>
        <div className={cs('title')}>2022학년도 그린 마일리지(상·벌점제) 운영 기준</div>
        
        <div className={cs('table-container')}>
          
          <div className={cs('minusPoint-table-container')}>
            <div className={cs('table-name')} style={{color: '#c5040a'}}>벌점 규정</div>
            <div className={cs('minusPoint-table')}>
              <table>
                <thead>
                <tr>
                  <th className={cs('th1')}>구분</th>
                  <th className={cs('th2')}>항</th>
                  <th className={cs('th3')}>적용내용</th>
                  <th className={cs('th4')}>점수</th>
                </tr>
                </thead>
                <tbody>
                {Object.values(minusPoint).map((log: any, index: number) => (
                  <tr key={index}>
                    <td className={cs('division')}>{log.division}</td>
                    <td className={cs('paragraph')}>{log.id}</td>
                    <td className={cs('contents')}><span/>{log.regulate}</td>
                    <td className={cs('score')}>{log.score}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={cs('bonusPoint-table-container')}>
            <div className={cs('table-name')} style={{color: '#04c504'}}>상점 규정</div>
            <div className={cs('bonusPoint-table')}>
              <table>
                <thead>
                <tr>
                  <th className={cs('th1')}>구분</th>
                  <th className={cs('th2')}>항</th>
                  <th className={cs('th3')}>적용내용</th>
                  <th className={cs('th4')}>점수</th>
                </tr>
                </thead>
                <tbody>
                {Object.values(bonusPoint).map((log: any, index: number) => (
                  <tr key={index}>
                    <td className={cs('division')}>{log.division}</td>
                    <td className={cs('paragraph')}>{log.id}</td>
                    <td className={cs('contents')}><span/>{log.regulate}</td>
                    <td className={cs('score')}>{log.score}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={cs('text-container')}>

          <div className={cs('box-1')}>
            <div className={cs('title')}>벌점 유의 사항</div>
            <br/>
            <div>
              * 같은 항목에 대하여 한 수업 시간에 1회 이상 지도함에도 불구하고 개선의 모습이 없으며, 수업을 방해할 시 바로 학생안전생활부로 송치하여 확인 후 선도 처리한다.
              <br/><br/>
              * 미인정 외출 적발 시 소지품 검사 및 흡연 측정 검사가 가능하며, 검사 결과 수치가 5 이상일 경우 흡연 학생으로 간주하여 벌점 부여한다.
            </div>
          </div>

          <div className={cs('box-2')}>
            <div className={cs('title')}>점수에 따른 선도처리 방법</div>
            <br/>
            <div>
              - 벌점 20점 시 → 1차 경고 <br/>
              - 벌점 40점 시 → 2차 경고 <br/>
              - 벌점 60점 시 → 선도위원회 회부 <br/>
              - 한 학년 동안 선도위원회 3회 개최 시 → 퇴학 조치 가능 <br/>
              - 재학기간(1~3학년) 동안 선도위원회 5회 개최 시 →퇴학 조치 가능 <br/>
            </div>

            <br/>
            <div>
              - 상점 10점 도달 시 초콜릿 증정 <br/>
              - 상점 20점 도달 시 과자 증정 <br/>
              - 상점 30점 도달 시 문화상품권 오천원권 (학기 말 증정) <br/>
              - 상점 다득점 시 순서에 따라 상점 캠프 진행 예정 <br/>
            </div>
          </div>

        </div>

        <button className={cs('main-btn')} onClick={() => navigate('/')}><AiOutlineHome style={{ marginBottom: '-2px' }}/> <span>메인으로</span></button>
      </div>
    )
  }
}

export default RuleTable