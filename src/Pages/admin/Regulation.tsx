import React from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";
import { MdChecklist } from "react-icons/md";
import LogoutButton from "../../Components/LogoutButton";

const Regulation = () => {

  return (
    <div>
      <div className={'top-tag'}>
        <AdminSideBar/>
        <div className={'page-name'}>
          <span><MdChecklist className={'page-name-icon'}/> 상벌점 규정 관리</span>
          <span><LogoutButton/></span>
        </div>
      </div>

      <div className={'container'}>
        <div className={'management-table-container'}>
        </div>
      </div>
    </div>
  )
}

export default Regulation