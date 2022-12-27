import React, { useEffect, useState } from 'react'
import Loading from "../Loading";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { AiOutlineCalendar } from "react-icons/ai";

interface userTotalType {
  userId: number,
  division: string,
  grade: number,
  class: number,
  number: number,
  name: string,
  bonus: string,
  minus: string,
  total: string,
  permission: number
}

const UserStatistics = () => {
  const [responseData, setResponseData] = useState<userTotalType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [userTotalValue, setUserTotalValue] = useState<userTotalType[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const [startDate, setStartDate] = useState<Date>(new Date(year, month, day - 7));
  const [endDate, setEndDate] = useState<Date>(date);

  const [headContent, setHeadContent] = useState([
    {'title': 'division', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'grade', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'class', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'number', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'name', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'bonus', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'minus', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'total', 'isHover': false, 'order': true, 'textValue': ''}
  ])

  useEffect(() => {
    fetch('http://localhost:3001/v1/point/total')
      .then((res) => res.json())
      .then((data) => {
        setResponseData(data.map((v: any) => ({...v, division: v.permission === 3 ? '고등학생' : '중학생'})))
        setUserTotalValue(data.map((v: any) => ({...v, division: v.permission === 3 ? '고등학생' : '중학생'})))
      })
      .then(() => setIsLoading(false))
      .catch(() => setIsError(false))
  }, [])

  const changeTextValue = (title: string, textValue: string) => {
    setTimeout(() => {
      setHeadContent(headContent.map((v: any) =>
        v.title === title ? {...v, textValue: textValue} : v
      ))
    }, 500)
  }

  useEffect(() => {
    setUserTotalValue(Object.values(responseData).filter((value) => (
      String(value.division).includes(headContent[0].textValue) &&
      String(value.grade).includes(headContent[1].textValue) &&
      String(value.class).includes(headContent[2].textValue) &&
      String(value.number).includes(headContent[3].textValue) &&
      value.name.includes(headContent[4].textValue) &&
      String(value.bonus).includes(headContent[5].textValue) &&
      String(value.minus).includes(headContent[6].textValue) &&
      String(value.total).includes(headContent[7].textValue)
    )))
  }, [headContent])

  const datePickerCustom = ({value, onClick}: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="date-picker-custom" onClick={onClick}>
      <AiOutlineCalendar className={'calendar-icon'}/>
      {value}
    </button>
  )

  if (isError) return <h1>ERROR</h1>
  else if (isLoading) return <Loading/>
  else {
    return (
      <div className={'container'} style={{width: '100%', height: '70vh'}}>
        <div className={'date-picker-container'}>
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
        <div className={'management-table-container'}>
          <table style={{ width: '99.5%', margin: 'auto' }}>
            <thead>
            <tr>
              <th style={{ width: '15%' }}>구분</th>
              <th style={{ width: '8.75%' }}>학년</th>
              <th style={{ width: '8.75%' }}>반</th>
              <th style={{ width: '8.75%' }}>번호</th>
              <th style={{ width: '15%' }}>이름</th>
              <th style={{ width: '8.75%' }}>상점</th>
              <th style={{ width: '8.75%' }}>벌점</th>
              <th style={{ width: '8.75%' }}>상쇄점</th>
              <th style={{ width: '8.75%' }}>이월점수</th>
              <th style={{ width: '8.75%' }}>누계</th>
            </tr>
            </thead>

            <tbody>
            {
              isSearchOpen && (<tr className={'search-tr'}>
                <td><input onChange={(e) => changeTextValue('division', e.target.value)}
                           maxLength={4}/></td>
                <td><input onChange={(e) => changeTextValue('grade', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('class', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('number', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('name', e.target.value)}
                           maxLength={4}/></td>
                <td><input onChange={(e) => changeTextValue('bonus', e.target.value)}
                           maxLength={3}/></td>
                <td><input onChange={(e) => changeTextValue('minus', e.target.value)}/></td>
                <td><input onChange={(e) => changeTextValue('total', e.target.value)}/></td>
              </tr>)
            }
            {Object.values(userTotalValue).map((v: any, i: number) => (
              <tr key={i} className={'border-tr'}>
                <td className={ headContent[0].textValue ? 'search-active' : ''}>{v.division}</td>
                <td className={ headContent[1].textValue ? 'search-active' : ''}>{v.grade}</td>
                <td className={ headContent[2].textValue ? 'search-active' : ''}>{v.class}</td>
                <td className={ headContent[3].textValue ? 'search-active' : ''}>{v.number}</td>
                <td className={ headContent[4].textValue ? 'search-active' : ''}>{v.name}</td>
                <td>{v.bonus}</td>
                <td>{v.minus}</td>
                <td>{0}</td>
                <td>{0}</td>
                <td>{v.total}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setIsSearchOpen(!isSearchOpen)}>검색창 오픈</button>
      </div>
    )
  }
}

export default UserStatistics