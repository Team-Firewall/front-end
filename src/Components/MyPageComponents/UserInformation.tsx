import React, { useEffect, useState } from 'react';
import styles from '../../Style/Components.module.css'
import classNames from "classnames/bind";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";

const cs = classNames.bind(styles)

const UserInformation = () => {
  const [userGrade, setUserGrade] = useState<number>()
  const [userClass, setUserClass] = useState<number>()
  const [userNumber, setUserNumber] = useState<number>()
  const [userPosition, setUserPosition] = useState<number>()
  const [username, setUserName] = useState<string>('')

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserGrade(decodeToken.grade)
    setUserClass(decodeToken.class)
    setUserPosition(decodeToken.position)
    setUserNumber(decodeToken.number)
    setUserName(decodeToken.name)
  }, [])
  return (
    <div className={cs('user-information-box')}>
      <div className={cs('basic-information-container')}>
        <div>
          <div className={cs('subheading')}>기본 정보</div>
          <div style={{marginTop: '20px'}}>
            <span className={cs('username')}>{username} </span>
            <span className={cs('user-position')}>
              {userPosition === 0 && (<span>관리자</span>)}
              {userPosition === 1 && (<span>선생님</span>)}
              {userPosition === 2 && (<span>관리자</span>)}
          </span>
          </div>
        </div>
        <div>
          {userGrade}학년 {userClass}반 {userNumber}번
        </div>
        <div>010-9285-9593</div>
      </div>

      <div className={cs('point-information-container')}>
        <div className={cs('subheading')}>상벌점 정보</div>
        <div style={{fontSize: '17px', color: '#264893', fontWeight: 'bold', marginTop: '20px'}}>{new Date().getFullYear()}학년도 상벌점 현황</div>
        <div><span style={{color: '#4EA14E'}}>상점</span> <span style={{fontSize: '20px'}}>총 30점</span>
        </div>
        <div style={{marginTop: '5px'}}><span style={{color: '#B53A3A'}}>벌점</span> <span style={{fontSize: '20px'}}>총 20점</span>
        </div>
        <div style={{marginTop: '5px'}}><span style={{color: '#3E62BD'}}>누계점수</span> <span style={{fontSize: '20px'}}>총 20점</span>
        </div>
      </div>

      <div className={cs('exclamation-phrases')} style={{fontSize: '20px'}}>* 정보에 이상이 있으면 선생님께 문의해 주세요.</div>
    </div>


  )
}

export default UserInformation