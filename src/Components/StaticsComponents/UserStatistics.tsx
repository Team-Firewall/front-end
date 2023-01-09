import React, { useEffect, useState } from 'react'
import Loading from "../Loading";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import { AiOutlineCalendar } from "react-icons/ai";
import { MdSearch, MdSearchOff } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import { ExcelDownloader } from "../../utils/ExcelDownloader";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import axios from "axios";

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
  const arrowUpButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, true)}>
        ▲
      </button>)
  }

  const arrowDownButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, false)}>
        ▼
      </button>
    )
  }

  const [responseData, setResponseData] = useState<userTotalType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [userTotalValue, setUserTotalValue] = useState<userTotalType[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  const date = new Date()
  const month = date.getMonth()
  const day = date.getDate()
  const year = date.getFullYear()
  const [startDate, setStartDate] = useState<Date>(month > 2 ? new Date(year, 2, 1) : new Date(year, month, day - 7));
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
    axios.post(`${process.env.REACT_APP_API_URL}/v1/user/total`)
      .then((res) => {
        console.log(res.data)
        setResponseData(res.data.map((v: any) => ({...v, division: v.permission === 3 ? '고등학생' : '중학생'})))
        setUserTotalValue(res.data.map((v: any) => ({...v, division: v.permission === 3 ? '고등학생' : '중학생'})))
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

  const searchHandler = () => {
    setHeadContent(headContent.map((it) =>
      it ? {...it, textValue: ''} : it
    ))
    setIsSearchOpen(!isSearchOpen)
  }

  const datePickerCustom = ({value, onClick}: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="date-picker-custom" onClick={onClick}>
      <AiOutlineCalendar className={'calendar-icon'}/>
      {value}
    </button>
  )

  const handleValueSort = (title: string, asc: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, order: asc ? true : false} : v
    ))

    if (title === 'grade') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.grade > b.grade) ? 1 : -1 : (a.grade < b.grade) ? 1 : -1)
    } else if (title === 'class') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.class > b.class) ? 1 : -1 : (a.class < b.class) ? 1 : -1)
    } else if (title === 'number') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.number > b.number) ? 1 : -1 : (a.number < b.number) ? 1 : -1)
    } else if (title === 'name') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.name > b.name) ? 1 : -1 : (a.name < b.name) ? 1 : -1)
    } else if (title === 'division') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.division > b.division) ? 1 : -1 : (a.division < b.division) ? 1 : -1)
    } else if (title === 'bonus') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.bonus > b.bonus) ? 1 : -1 : (a.bonus < b.bonus) ? 1 : -1)
    } else if (title === 'minus') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.minus > b.minus) ? 1 : -1 : (a.minus < b.minus) ? 1 : -1)
    } else if (title === 'total') {
      responseData.sort((a: userTotalType, b: userTotalType) => asc ? (a.total > b.total) ? 1 : -1 : (a.total < b.total) ? 1 : -1)
    }

    setResponseData([...responseData])
  }

  const handleMouseOver = (title: string, hover: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, isHover: hover ? true : false} : v
    ))
  }

  if (isError) return <h1>ERROR</h1>
  else if (isLoading) return <Loading/>
  else {
    return (
      <div className={'container'} style={{width: '100%', height: '66vh'}}>
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
              <th style={{ width: '15%' }}>
                <span onMouseOver={() => handleMouseOver('division', true)}
                      onMouseLeave={() => handleMouseOver('division', false)}>
                  구분
                  {
                    headContent[0].isHover ? headContent[0].order ? arrowDownButton('division') : arrowUpButton('division') : ''
                  }
                  </span>
              </th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('grade', true)}
                      onMouseLeave={() => handleMouseOver('grade', false)}>
                  학년
                  {
                    headContent[1].isHover ? headContent[1].order ? arrowDownButton('grade') : arrowUpButton('grade') : ''
                  }
                  </span>
              </th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('class', true)}
                      onMouseLeave={() => handleMouseOver('class', false)}>
                  반
                  {
                    headContent[2].isHover ? headContent[2].order ? arrowDownButton('class') : arrowUpButton('class') : ''
                  }
                </span>
              </th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('number', true)}
                      onMouseLeave={() => handleMouseOver('number', false)}>
                  번호
                  {
                    headContent[3].isHover ? headContent[3].order ? arrowDownButton('number') : arrowUpButton('number') : ''
                  }
                </span>
              </th>
              <th style={{ width: '15%' }}>
                <span onMouseOver={() => handleMouseOver('name', true)}
                      onMouseLeave={() => handleMouseOver('name', false)}>
                  이름
                  {
                    headContent[4].isHover ? headContent[4].order ? arrowDownButton('name') : arrowUpButton('name') : ''
                  }
                </span>
              </th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('bonus', true)}
                      onMouseLeave={() => handleMouseOver('bonus', false)}>
                  상점
                  {
                    headContent[5].isHover ? headContent[5].order ? arrowDownButton('bonus') : arrowUpButton('bonus') : ''
                  }
                </span>
              </th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('minus', true)}
                      onMouseLeave={() => handleMouseOver('minus', false)}>
                  벌점
                  {
                    headContent[6].isHover ? headContent[6].order ? arrowDownButton('minus') : arrowUpButton('minus') : ''
                  }
                </span>
              </th>
              <th style={{ width: '8.75%' }}>상쇄점</th>
              <th style={{ width: '8.75%' }}>이월점수</th>
              <th style={{ width: '8.75%' }}>
                <span onMouseOver={() => handleMouseOver('total', true)}
                      onMouseLeave={() => handleMouseOver('total', false)}>
                  누계
                  {
                    headContent[7].isHover ? headContent[7].order ? arrowDownButton('total') : arrowUpButton('total') : ''
                  }
                </span>
              </th>
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
                <td><input onChange={(e) => changeTextValue('minus', e.target.value)}
                           maxLength={3}/></td>
                <td><input onChange={(e) => changeTextValue('', e.target.value)}
                           maxLength={3}/></td>
                <td><input onChange={(e) => changeTextValue('', e.target.value)}/></td>
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
                <td className={ headContent[5].textValue ? 'search-active' : ''}>{v.bonus}</td>
                <td className={ headContent[6].textValue ? 'search-active' : ''}>{v.minus}</td>
                <td>{0}</td>
                <td>{0}</td>
                <td className={ headContent[7].textValue ? 'search-active' : ''}>{v.total}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={'search-button-container'}>
          <button style={{float: 'left', marginLeft: '0'}} className={'search-btn'}
                  onClick={searchHandler}>
            {
              isSearchOpen ? (<><MdSearchOff className={'icon, search-icon'}/> 검색 닫기</>) :
                (<><MdSearch className={'icon, search-icon'}/> 검색하기</>)
            }
          </button>
          <button className={'print-btn'}><BsFillPrinterFill className={'icon'}/> 인쇄하기</button>
          <button className={'excel-btn'}
                  onClick={() => ExcelDownloader(userTotalValue, '발급내역', startDate, endDate)}>
            <RiFileExcel2Fill className={'icon'}/> 엑셀로 저장
          </button>
        </div>
      </div>
    )
  }
}

export default UserStatistics