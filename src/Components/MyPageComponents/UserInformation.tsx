import React, { useEffect, useState } from 'react';
import styles from '../../Style/Components.module.css'
import classNames from "classnames/bind";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";

const cs = classNames.bind(styles)

const UserInformation = () => {
  const [userGrade, setUserGrade] = useState<number>(2)
  const [userClass, setUserClass] = useState<number>(2)
  const [userNumber, setUserNumber] = useState<number>(2)
  const [userPosition, setUserPosition] = useState<number>(0)
  const [username, setUserName] = useState<string>('테스트')

  return (
    <div className={cs('user-information-box')}>
      <div className={'main-heading'} style={{ color: '#258c09' }}>기본 정보</div>
      <div className={cs('basic-information-container')}>
        <div>
          <div>
            <div className={'subheading'}>학생 정보</div>
            <div className={'division'}>이름</div>
            <div className={cs('general-sentence')}>
              <span className={cs('username', 'general-sentence')}>{username} </span>
              <span className={cs('user-position')}>
                {userPosition === 0 && (<span>학생</span>)}
                {userPosition === 1 && (<span>선생님</span>)}
                {userPosition === 2 && (<span>관리자</span>)}
              </span>
            </div>
          </div>
        </div>
        <div className={'division'}>학번</div>
        <div className={cs('general-sentence')}>
          {userPosition === 0 && '경북소프트웨어고등학교'} {userPosition === 1 && '봉양중학교'} {userGrade}학년 {userClass}반 {userNumber}번
        </div>
        <div className={'division'}>전화번호</div>
        <div className={cs('general-sentence')}>010-9285-9593</div>
      </div>

      <div className={cs('point-information-container')}>
        <div className={'subheading'}>
          상벌점 정보
          <div style={{fontSize: '15px', color: '#264893', fontWeight: 'bold'}}>
            {new Date().getFullYear()}학년도 상벌점 현황
          </div>
        </div>
        <div className={cs('general-sentence-point')}>
          <span style={{color: '#17a617', fontWeight: 'bold'}}>상점</span> 총 35점
        </div>
        <div className={cs('general-sentence-point')}>
          <span style={{color: '#d51515', fontWeight: 'bold'}}>벌점</span> 총 20점
        </div>
        <div className={cs('general-sentence-point')}>
          <span style={{color: '#3E62BD', fontWeight: 'bold'}}>누계점수</span> 총 15점
        </div>
      </div>

      <div className={cs('exclamation-phrases')}>* 정보에 이상이 있으면 선생님께 문의해 주세요.</div>
    </div>
  )
}

export default UserInformation