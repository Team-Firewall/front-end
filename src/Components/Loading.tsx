import React from 'react'
import classNames from "classnames/bind";
import style from '../Style/Loading.module.css'

const cs = classNames.bind(style)

const Loading = () => {
  return (
    <div className={cs('loading-container')}>
      <div className={cs("spinner")}>
        <svg viewBox="25 25 50 50" className={cs("circular")}>
          <circle stroke-miterlimit="10" stroke-width="3" fill="none" r="20" cy="50" cx="50"
                  className={cs("path")}></circle>
        </svg>
      </div>
    </div>
  )
}

export default Loading