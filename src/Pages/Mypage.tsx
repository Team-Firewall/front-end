import React, { useEffect, useState } from 'react'
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "../Components/LogoutButton";
import styles from '../Style/Mypage.module.css'
import classNames from "classnames/bind";
import UserInformation from "../Components/MyPageComponents/UserInformation";
import ParentsInformation from "../Components/MyPageComponents/ParentsInformation";
import ChangePassword from "../Components/MyPageComponents/ChangePassword";
import AdminSideBar from "../Components/Sidebar/AdminSideBar";
import UserSideBar from "../Components/Sidebar/UserSideBar";

const cs = classNames.bind(styles)

const MyPage = () => {

  const [username, setUserName] = useState<string>('')
  const [informationState, setInformationState] = useState<number>(0)
  const [permission, setPermission] = useState<number>(NaN)

  useEffect(() => {
    let token = getItemWithExpireTime()
    token = jwt_decode(token)
    setUserName(token.name)
    setPermission(token.permission)
  }, [])

  return (
    <div>

      <div className={'top-tag'}>
        {
          [0, 1, 2].includes(permission) ? (<AdminSideBar/>) : (<UserSideBar/>)
        }
        <div className={'page-name'}>
          <span><FaUserCircle className={'page-name-icon'}/> 마이페이지</span>
          <span><LogoutButton/></span>
        </div>
      </div>

      <div className={cs('my-page-container')}>

        <div className={cs('username-tag')}><span style={{ color: '#8685ef'}}>{username}</span>님의 정보</div>

        <div className={cs('edit-box-container')}>
          <div className={cs('edit-box', 'first-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>기본정보</div>
              <div className={cs('div-tag-bottom')}>이름, 전화번호, 학번, 상벌점</div>
            </div>

            <button onClick={() => setInformationState(0)} className={cs(informationState === 0 && 'activated-btn')}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'second-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>보호자 정보</div>
              <div className={cs('div-tag-bottom')}>학부모, 담임선생님 정보</div>
            </div>

            <button onClick={() => setInformationState(1)} className={cs(informationState === 1 && 'activated-btn')}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'third-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>비밀번호 변경</div>
              <div className={cs('div-tag-bottom')} >비밀번호를 변경합니다.</div>
            </div>

            <button onClick={() => setInformationState(2)} className={cs(informationState === 2 && 'activated-btn')}>수정</button>
          </div>

        </div>

        <div className={cs('information-component-container')}>
          {
            informationState === 0 && (
              <UserInformation/>
            )
          }
          {
            informationState === 1 && (
              <ParentsInformation/>
            )
          }
          {
            informationState === 2 && (
              <ChangePassword/>
            )
          }
        </div>

      </div>

    </div>
  )
}

export default MyPage