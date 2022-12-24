import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";
import { MdChecklist } from "react-icons/md";
import LogoutButton from "../../Components/LogoutButton";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";

const Regulation = () => {
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
}

export default Regulation