import React from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";
import { TbDeviceAnalytics } from "react-icons/tb";
import LogoutButton from "../../Components/LogoutButton";

const Statistics = () => {

  return (
    <div>
      <div className={'top-tag'}>
        <AdminSideBar/>
        <div className={'page-name'}>
          <span><TbDeviceAnalytics className={'page-name-icon'}/> 자료 조회 및 통계</span>
          <span><LogoutButton/></span>
        </div>
      </div>
    </div>
  )
}
export default Statistics