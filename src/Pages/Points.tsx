import React, { useEffect, useState } from 'react'
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import classNames from "classnames/bind";
import styles from '../Style/Points.module.css'
import PointTimeLine from "../Components/PointTimeLine";
import PointTable from "../Components/PointTable";
import { RiAwardLine } from 'react-icons/ri'
import LogoutButton from "../Components/LogoutButton";
import UserSideBar from "../Components/Sidebar/UserSideBar";
import axios, { AxiosResponse } from "axios";
import Loading from "../Components/Loading";

const cs = classNames.bind(styles)

const Points = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [username, setUserName] = useState<string>('')
  const [data, setData] = useState<Object>([])

  useEffect(() => {
    let token = getItemWithExpireTime()
    token = jwt_decode(token)
    setUserName(token.name)
    fetchUserHistory(token.userid)
  }, [])

  const fetchUserHistory = (id: number) => {
    let data = {'userId': id}
    console.log(id)
    axios.post('http://localhost:3001/v1/point/history', JSON.stringify(data), {
      headers: {'Content-Type': 'application/json'}
    })
      .then((res: AxiosResponse<any>) => {
        if (res.status === 200) {
          setData(res.data)
          setIsLoading(false)
        }
      })
      .catch(() => setIsError(true))
  }

  const year = new Date().getFullYear()

  if (isError) return <h1>ERROR</h1>
  else if (isLoading) return <Loading/>
  else {
    return (
      <div>
        <UserSideBar/>
        <div className={'top-tag'}>
          <div className={'page-name'}>
            <span><RiAwardLine className={'page-name-icon'}/> 상/벌점 조회</span>
            <span><LogoutButton/></span>
          </div>
        </div>

        <div className={'container'}>
          <div className={cs('username-tag')}><span style={{color: '#8685ef'}}>{username}</span>님의 상벌점 이력</div>
          <div>{year}학년도 총계 상점 3점 벌점 -4점 누계 32점</div>
          <PointTable data={data}/>
          <PointTimeLine data={data}/>
        </div>

      </div>
    )
  }
}

export default Points