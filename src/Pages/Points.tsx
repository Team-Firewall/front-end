import React, { useEffect, useState } from 'react'
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import classNames from "classnames/bind";
import styles from '../Style/Points.module.css'
import PointTable from "../Components/PointTable";
import { RiAwardLine } from 'react-icons/ri'
import LogoutButton from "../Components/LogoutButton";
import UserSideBar from "../Components/Sidebar/UserSideBar";
import axios, { AxiosResponse } from "axios";
import Loading from "../Components/Loading";
import { AiOutlineCalendar } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { useSessionStorage } from "react-use";

const cs = classNames.bind(styles)

const Points = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [username, setUserName] = useState<string>('')
  const [data, setData] = useState<Object>([])
  const [totalData, setTotalData] = useState<Object>([])

  const date = new Date()
  const year = date.getFullYear()

  const [startDate, setStartDate] = useState<Date>(new Date(year, 2, 2));
  const [endDate, setEndDate] = useState<Date>(date);

  const datePickerCustom = ({value, onClick}: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="date-picker-custom" onClick={onClick}>
      <AiOutlineCalendar className={'calendar-icon'}/>
      {value}
    </button>
  )

  useEffect(() => {
    let token = getItemWithExpireTime()
    token = jwt_decode(token)
    setUserName(token.name)
    fetchUserHistory(token.userid)
    fetchTotalHistory(token.userid)
  }, [])

  const fetchUserHistory = (id: number) => {
    let data = {'id': id}
    axios.post('http://localhost:3001/v1/point/history', JSON.stringify(data), {
      headers: {'Content-Type': 'application/json'}
    })
      .then((res: AxiosResponse<any>) => {
        if (res.status === 200) {
          setData(res.data.finalResult)
        }
      })
      .catch((error) => console.log(error))
  }

  const fetchTotalHistory = (id: number) => {
    let data = {'userId': id}
    axios.post('http://localhost:3001/v1/point/user', JSON.stringify(data), {
      headers: {'Content-Type': 'application/json'}
    })
      .then((res: AxiosResponse<any>) => {
        if (res.status === 200) {
          setTotalData(res.data)
          setIsLoading(false)
        }
      })
      .catch(() => setIsError(true))
  }

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

          <div className={cs('points-header')}>
            <span style={{color: '#1363DF'}}>{username}</span>님의 상벌점 이력
            <div className={'date-picker-container'} style={{ float: 'right', marginTop: '0' }}>
              <DatePicker
                locale={ko}
                dateFormat={'yyyy-MM-dd'}
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                startDate={startDate}
                customInput={React.createElement(datePickerCustom)}
                endDate={endDate}
                maxDate={endDate}
              />
              <span className={'date-hyphen'}>-</span>
              <DatePicker
                locale={ko}
                dateFormat={'yyyy-MM-dd'}
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                startDate={startDate}
                endDate={endDate}
                customInput={React.createElement(datePickerCustom)}
                minDate={startDate}
                maxDate={date}
              />

              <div className={'lookup-btn'}>
                <button>조회</button>
              </div>
            </div>
          </div>

          <PointTable data={data} totalData={totalData}/>
          {/*<PointTimeLine data={data}/>*/}
        </div>

      </div>
    )
  }
}

export default Points