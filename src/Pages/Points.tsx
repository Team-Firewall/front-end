import React, { useEffect, useState } from 'react'
import { getItemWithExpireTime, Logout } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import classNames from "classnames/bind";
import styles from '../Style/Points.module.css'
import PointTimeLine from "../Components/PointTimeLine";
import PointTable from "../Components/PointTable";
import { AiOutlineHome } from 'react-icons/ai'
import LogoutButton from "../Components/LogoutButton";
import UserSideBar from "../Components/Sidebar/UserSideBar";

const cs = classNames.bind(styles)

const Points = () => {
  const [username, setUserName] = useState<string>('테스트')

  return (
    <div>
      <UserSideBar/>
      <div className={'top-tag'}>
        <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'} /></span> {'>'} 상•벌점 조회</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <div className={'container'}>
        <div className={cs('username-tag')}>{username}님의 상벌점 이력</div>
        <PointTable/>
        <PointTimeLine/>
      </div>

    </div>
  )
}

export default Points