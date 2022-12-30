import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import styles from '../Style/MobileView.module.css'
import classNames from "classnames/bind";
import logo from '../images/ScoolFullLogo.png'

const cs = classNames.bind(styles)

const MobileNotSupportedView = () => {
  return (
    <div className={cs('mobile-view')}>
      <div className={cs('container')}>
        <span className={cs('icon')}><RiErrorWarningFill/></span>
        <div className={cs('title')}>Mobile Device Not Supported</div>
        <br/>
        <div className={cs('text-container')}>
          <div>현재 모바일 디바이스는 지원하지 않습니다.</div>
          <div>스토어에서 앱 다운로드 후 이용해 주세요.</div>
        </div>
      </div>

      <footer>
        <img src={logo}/>
      </footer>
    </div>
  )
}

export default MobileNotSupportedView