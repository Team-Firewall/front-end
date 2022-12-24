import React, { useEffect, useState } from 'react'
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import classNames from "classnames/bind";
import styles from '../Style/Points.module.css'
import PointTimeLine from "../Components/PointTimeLine";
import PointTable from "../Components/PointTable";
import { RiAwardLine } from 'react-icons/ri'
import LogoutButton from "../Components/LogoutButton";
import UserSideBar from "../Components/Sidebar/UserSideBar";

const cs = classNames.bind(styles)

const Points = () => {
  const [username, setUserName] = useState<string>('')

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserName(decodeToken.name)
  }, [])

  return (
    <div>
      <UserSideBar/>
      <div className={'top-tag'}>
        <div className={'page-name'}>
          <span><RiAwardLine className={'page-name-icon'}/> 상/벌점 조회</span>
          <span><LogoutButton/></span>
        </div>
      </div>

      <div className={'container'}>
        <div className={cs('username-tag')}><span style={{ color: '#8685ef'}}>{username}</span>님의 상벌점 이력</div>
        <PointTable/>
        <PointTimeLine/>
      </div>

    </div>
  )
}

export default Points