import React from 'react'
import styles from '../Style/Components.module.css'
import classNames from "classnames/bind"
import { MdOutlineLogout } from 'react-icons/md'
import { Logout } from "../utils/ControllToken";

const cs = classNames.bind(styles)

export default function LogoutButton() {
  return  <span className={cs("logout-span")} onClick={Logout}><MdOutlineLogout style={{ marginBottom: '-2px', marginRight: '2px' }}/>로그아웃</span>
}
