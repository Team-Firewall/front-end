import React, { useEffect, useState } from "react";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { AiOutlineHome } from "react-icons/ai";
import LogoutButton from "../../Components/LogoutButton";
import RecipientTable from "../../Components/IssuanceComponents/RecipientTable";
import IssuanceModal from "../../Components/Modal/IssuanceModal";
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";

const Issuance = () => {
  const [userPosition, setUserPosition] = useState<number>()

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserPosition(decodeToken.position)
  }, [])

  if (userPosition === 0 || userPosition === 2) {
    return (
      <div>notFound</div>
    )
  }
  else {
    return (
      <div>
        <AdminSideBar/>

        <div className={'top-tag'}>
          <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 점수 발급</span>
          <span><LogoutButton/></span>
          <div className={'divider-line'}/>
        </div>

        <div className={'container'}>
          <IssuanceModal/>
          <RecipientTable/>
        </div>
      </div>
    )
  }
}

export default Issuance