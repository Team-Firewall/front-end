import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getItemWithExpireTime, Logout } from "../utils/ControllToken";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../images/ScoolFullLogo.png";
import { TbUser } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { GoThreeBars } from "react-icons/go";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import jwt_decode from "jwt-decode";
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

  const [username, setUserName] = useState<string>('')
  const [informationState, setInformationState] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserName(decodeToken.name)
  }, [])

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