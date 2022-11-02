import React, { useEffect, useState } from "react";
import { getItemWithExpireTime, Logout } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { AiOutlineHome } from "react-icons/ai";
import LogoutButton from "../../Components/LogoutButton";
import AddUserWithTyping from "../../Components/AddUserComponents/AddUserWithTyping";
import AddUserWithFile from "../../Components/AddUserComponents/AddUserWithFile";
import classNames from "classnames/bind";
import styles from '../../Style/AddUser.module.css'
import { AiOutlineUserAdd, AiOutlineUser } from 'react-icons/ai'
import { RiFileExcel2Line, RiAdminLine } from 'react-icons/ri'
import StudentParentManagement from "../../Components/AddUserComponents/StudentParentManagement";
import TeacherManagement from "../../Components/AddUserComponents/TeacherManagement";
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";

const cs = classNames.bind(styles)

const AddUser = () => {

  const [userPosition, setUserPosition] = useState<number>()
  const [username, setUsername] = useState<string>('')
  const [componentState, setComponentState] = useState<number>(0)

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserPosition(decodeToken.position)
    setUsername(decodeToken.name)
  }, [])

  return (
    <div>
     <AdminSideBar/>
      <div className={'top-tag'}>
        <span className={'page-name'}><span><AiOutlineHome
          className={'page-name-icon'}/></span> {'>'} 사용자 추가 및 관리</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <div className={'container'}>
        <div className={cs('button-container')}>
          <button onClick={() => setComponentState(0)}
                  className={cs(componentState === 0 ? 'active-button' : 'not-active-btn', 'button-border-right-none')}
                  style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }}>
            <AiOutlineUserAdd className={cs('icon')}/> <span>사용자 추가</span>
          </button>

          <button onClick={() => setComponentState(1)}
                  className={cs(componentState === 1 ? 'active-button' : 'not-active-btn', 'button-border-right-none')}>
            <RiFileExcel2Line className={cs('icon')}/> <span>사용자 추가 (Excel)</span>
          </button>

          <button onClick={() => setComponentState(2)}
                  className={cs(componentState === 2 ? 'active-button' : 'not-active-btn', 'button-border-right-none')}>
            <AiOutlineUser className={cs('icon')}/> <span>학생/학부모 관리</span>
          </button>

          <button onClick={() => setComponentState(3)}
                  className={cs(componentState === 3 ? 'active-button' : 'not-active-btn', 'button-border-right')}
                  style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}>
            <RiAdminLine className={cs('icon')}/> <span>교직원 관리</span>
          </button>
        </div>

        <div>
          {componentState === 0 && (<AddUserWithTyping/>)}

          {componentState === 1 && (<AddUserWithFile/>)}

          {componentState === 2 && (<StudentParentManagement/>)}

          {componentState === 3 && (<TeacherManagement/>)}
        </div>
      </div>

    </div>
  )
}

export default AddUser