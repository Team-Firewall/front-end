import React, { useEffect, useState } from 'react'
import { AiOutlineHome } from "react-icons/ai";
import LogoutButton from "../Components/LogoutButton";
import styles from '../Style/Mypage.module.css'
import classNames from "classnames/bind";
import UserInformation from "../Components/MyPageComponents/UserInformation";
import ParentsInformation from "../Components/MyPageComponents/ParentsInformation";
import ChangePassword from "../Components/MyPageComponents/ChangePassword";
import AdminSideBar from "../Components/Sidebar/AdminSideBar";

const cs = classNames.bind(styles)

const MyPage = () => {

  const [username, setUserName] = useState<string>('테스트')
  const [informationState, setInformationState] = useState<number>(0)

  return (
    <div>
     <AdminSideBar/>

      <div className={'top-tag'}>
        <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 마이페이지</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <div className={cs('my-page-container')}>

        <div className={cs('username-tag')}>{username}님의 정보</div>

        <div className={cs('edit-box-container')}>
          <div className={cs('edit-box', 'first-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>기본정보</div>
              <div className={cs('div-tag-bottom')}>이름, 전화번호, 학번, 상벌점</div>
            </div>

            <button onClick={() => setInformationState(0)}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'second-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>보호자 정보</div>
              <div className={cs('div-tag-bottom')}>학부모, 담임선생님 정보</div>
            </div>

            <button onClick={() => setInformationState(1)}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'third-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>비밀번호 변경</div>
              <div className={cs('div-tag-bottom')}>비밀번호를 변경합니다.</div>
            </div>

            <button onClick={() => setInformationState(2)}>수정</button>
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