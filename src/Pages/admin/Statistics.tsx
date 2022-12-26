import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";
import { TbDeviceAnalytics } from "react-icons/tb";
import LogoutButton from "../../Components/LogoutButton";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FcInfo } from "react-icons/fc";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import LinesEllipsis from "react-lines-ellipsis";
import { MdSearch, MdSearchOff } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import { ExcelDownloader } from "../../utils/ExcelDownloader";
import { RiFileListLine } from "react-icons/ri";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { FaUser, FaUserTie } from "react-icons/fa";
import AddUserWithTyping from "../../Components/AddUserComponents/AddUserWithTyping";
import AddUserWithFile from "../../Components/AddUserComponents/AddUserWithFile";
import StudentParentManagement from "../../Components/AddUserComponents/StudentParentManagement";
import classNames from "classnames/bind";
import styles from '../../Style/Statistics.module.css'
import UserStatistics from "../../Components/StaticsComponents/UserStatistics";

const cs = classNames.bind(styles)

interface dataValue {
  id: number,
  grade: number,
  class: number,
  name: string,
  userId: number,
  number: number,
  division: string,
  regulateId: number,
  reason: string,
  score: number,
  issuer: string,
  issuerId: string,
  regulate: string,
  createdDate: string,
  createdTime: string,
  updatedDate: string,
  updatedTime: string,
  checked: string,
  isChecked: boolean
}

const Statistics = () => {
  const [componentState, setComponentState] = useState<number>(0)
  const [permission, setPermission] = useState<number>(NaN)

  useEffect(() => {
    let token = getItemWithExpireTime()
    if (token) {
      token = jwt_decode(token)
      setPermission(token.permission)
    }
  }, [])

  if (![0, 1, 2].includes(permission)) {
    return (<div>notFound</div>)
  } else {
    return (
      <div>
        <div className={'top-tag'}>
          <AdminSideBar/>
          <div className={'page-name'}>
            <span><TbDeviceAnalytics className={'page-name-icon'}/> 자료 조회 및 통계</span>
            <span><LogoutButton/></span>
          </div>
        </div>

        <div className={'container'}>
          <div className={cs('button-container')}>
            <button onClick={() => setComponentState(0)}
                    className={cs(componentState === 0 ? 'active-button' : 'not-active-btn', 'button-border-right-none')}
                    style={{borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'}}>
              <FaUser className={cs('icon')}/> <span>학생별 누계자료</span>
            </button>

            <button onClick={() => setComponentState(1)}
                    className={cs(componentState === 1 ? 'active-button' : 'not-active-btn', 'button-border-right-none')}>
              <RiFileListLine className={cs('icon')}/> <span>항목별 통계</span>
            </button>

            <button onClick={() => setComponentState(2)}
                    className={cs(componentState === 2 ? 'active-button' : 'not-active-btn', 'button-border-right')}>
              <FaUserTie className={cs('icon')}/> <span>교사별 통계</span>
            </button>
          </div>

          <div>
            {componentState === 0 && (<UserStatistics/>)}

            {componentState === 1 && (<AddUserWithFile/>)}

            {componentState === 2 && (<StudentParentManagement/>)}
          </div>
        </div>

      </div>
    )
  }
}
export default Statistics