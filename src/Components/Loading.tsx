import React from 'react'
import classNames from "classnames/bind";
import style from '../Style/Loading.module.css'

const cs = classNames.bind(style)

const Loading = () => {
  return (
    <div className={cs("wrapper")}>
      <div className={cs("circle")}></div>
      <div className={cs("circle")}></div>
      <div className={cs("circle")}></div>
      <div className={cs("shadow")}></div>
      <div className={cs("shadow")}></div>
      <div className={cs("shadow")}></div>
    </div>
  )
}

export default Loading