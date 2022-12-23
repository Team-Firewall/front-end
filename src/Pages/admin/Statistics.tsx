import React from 'react'
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
import { RiFileExcel2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";

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

  return (
    <div>
      <div className={'top-tag'}>
        <AdminSideBar/>
        <div className={'page-name'}>
          <span><TbDeviceAnalytics className={'page-name-icon'}/> 자료 조회 및 통계</span>
          <span><LogoutButton/></span>
        </div>
      </div>

      <div className={'container'} style={{marginTop: '1vh'}}>
        <div className={'management-table-container'} style={{height: '90%'}}>
        </div> 
      </div>
    </div>
  )
}
export default Statistics