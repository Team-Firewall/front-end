import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/esm/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FiDelete } from 'react-icons/fi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { BsFillPrinterFill } from 'react-icons/bs'
import { ExcelDownloader } from '../../utils/ExcelDownloader'
import { MdSearch, MdSearchOff } from 'react-icons/md'
import axios from "axios";

const cs = classNames.bind(styles)

interface dataValue {
  id: number,
  grade: number,
  class: number,
  name: string,
  userId: number,
  number: number,
  division: string,
  regulateId: number,
  reason: string,
  score: number,
  issuer: string,
  regulate: string,
  createdDate: string,
  createdTime: string,
  updatedDate: string,
  updatedTime: string,
  checked: string,
  isChecked: boolean
}

const History = () => {
  const arrowUpButton = (title: string) => {
    return (
      <button className={'arrowUpButton'} onClick={() => handleValueSort(title, true)}>
        <BsArrowUp className={'arrow-icon'}/>
      </button>)
  }

  const arrowDownButton = (title: string) => {
    return (
      <button className={'arrowUpButton'} onClick={() => handleValueSort(title, false)}>
        <BsArrowDown className={'arrow-icon'}/>
      </button>
    )
  }

  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  const [startDate, setStartDate] = useState<Date>(new Date(year, month, day - 7));
  const [endDate, setEndDate] = useState<Date>(date);
  const [headCheckbox, setHeadCheckbox] = useState<boolean>(false)

  const [data, setData] = useState<dataValue[]>([])
  const [tableData, setTableData] = useState<dataValue[]>([])

  const [headContent, setHeadContent] = useState([
    {'title': 'grade', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'class', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'number', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'name', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'division', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'regulate', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'score', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'issuer', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'date', 'isHover': false, 'order': true, 'textValue': ''}
  ])

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  useEffect(() => {
    fetch('http://localhost:3001/v1/point')
      .then((response) => response.json())
      .then((data) => {
        setData(data.map((v: any) => ({...v, isChecked: false})))
        setTableData(data)
        console.log(data)
      })
  }, [])

  const searchHandler = () => {
    setHeadContent(headContent.map((it) =>
      it ? {...it, textValue: ''} : it
    ))
    setIsSearchOpen(!isSearchOpen)
  }

  const changeTextValue = (title: string, textValue: string) => {
    setTimeout(() => {
      setHeadContent(headContent.map((v: any) =>
        v.title === title ? {...v, textValue: textValue} : v
      ))
    }, 500)
  }

  useEffect(() => {
    setTableData(Object.values(data).filter((value) => (
      String(value.grade).includes(headContent[0].textValue) &&
      String(value.class).includes(headContent[1].textValue) &&
      String(value.number).includes(headContent[2].textValue) &&
      value.name.includes(headContent[3].textValue) &&
      value.checked.includes(headContent[4].textValue) &&
      value.regulate.includes(headContent[5].textValue) &&
      String(value.score).includes(headContent[6].textValue) &&
      value.issuer.includes(headContent[7].textValue) &&
      value.createdDate.includes(headContent[8].textValue)
    )))
  }, [headContent])

  const datePickerCustom = ({
                              value,
                              onClick
                            }: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="date-picker-custom" onClick={onClick}>
      <AiOutlineCalendar className={'calendar-icon'}/>
      {value}
    </button>
  )


  const checkAllButton = (isClicked: boolean) => {
    setHeadCheckbox(!headCheckbox)
    setTableData(tableData.map((v: dataValue) =>
      v.id ? {...v, isChecked: isClicked ? true : false} : v
    ))
  }

  const handelCheckButton = (idx: number) => {
    setTableData(tableData.map((v: dataValue) =>
      v.id === idx ? {...v, isChecked: !v.isChecked} : v
    ))

    let flag: boolean = true
    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].isChecked) {
        flag = false
      }
    }

    if (flag) {

    }
  }

  const handleMouseOver = (title: string, hover: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, isHover: hover ? true : false} : v
    ))
  }

  const handleValueSort = (title: string, asc: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, order: asc ? true : false} : v
    ))

    if (title === 'grade') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.grade < b.grade) ? 1 : -1 : (a.grade > b.grade) ? 1 : -1)
    } else if (title === 'class') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.class < b.class) ? 1 : -1 : (a.class > b.class) ? 1 : -1)
    } else if (title === 'number') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.number < b.number) ? 1 : -1 : (a.number > b.number) ? 1 : -1)
    } else if (title === 'name') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.name > b.name) ? 1 : -1 : (a.name < b.name) ? 1 : -1)
    } else if (title === 'division') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.division > b.division) ? 1 : -1 : (a.division < b.division) ? 1 : -1)
    } else if (title === 'regulate') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.regulate > b.regulate) ? 1 : -1 : (a.regulate < b.regulate) ? 1 : -1)
    } else if (title === 'score') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.score < b.score) ? 1 : -1 : (a.score > b.score) ? 1 : -1)
    } else if (title === 'issuer') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.issuer < b.issuer) ? 1 : -1 : (a.issuer > b.issuer) ? 1 : -1)
    } else if (title === 'date') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.createdDate > b.createdDate) ? 1 : -1 : (a.createdDate < b.createdDate) ? 1 : -1)
    }

    setData([...data])

    console.log(headContent)
  }

  const lookupDate = () => {
    const firstDate: string = startDate.getFullYear() + '-' + Number(startDate.getMonth() + 1) + '-' + startDate.getDate()
    const secondDate: string = endDate.getFullYear() + '-' + Number(endDate.getMonth() + 1) + '-' + endDate.getDate()

    let reqData = {
      'firstDate': firstDate,
      'secondDate': secondDate
    }

    console.log(reqData)

    axios.post('http://localhost:3001/v1/point/date', JSON.stringify(reqData), {
      headers: {'Content-Type': 'application/json'}
    }).then((res) => {
      setData(res.data.data.map((v: any) => ({...v, isChecked: false})))
      setTableData(res.data.data.map((v: any) => ({...v, isChecked: false})))
    }).catch(() => {
      alert('두 날짜 사이의 발급내역이 존재하지 않습니다.')
    })
  }

  const editHistory = (id: number) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        console.log(data[i])
      }
    }
  }

  if (!tableData) {
    return <Loading/>
  } else {
    return (
      <div>
        <div className={'top-tag'}>
          <AdminSideBar/>
          <div className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 발급 내역
            <span><LogoutButton/></span>
          </div>
        </div>

        <div className={'date-picker-container'}>
          <DatePicker
            locale={ko}
            dateFormat={'yyyy-MM-dd'}
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            startDate={startDate}
            customInput={React.createElement(datePickerCustom)}
            endDate={endDate}
            maxDate={date}
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
            <button onClick={lookupDate}>조회</button>
          </div>

        </div>

        <div className={'container'} style={{marginTop: '1vh'}}>
          <div className={'management-table-container'} style={{height: '90%'}}>
            <table>
              <thead>
              <th
                style={{width: '3%'}}
              ><input type={"checkbox"} onClick={(e) => checkAllButton(e.currentTarget.checked)} checked={headCheckbox}/></th>

              <th
                style={{width: '5%'}}
                className={'number-value'}
                onMouseOver={() => handleMouseOver('grade', true)}
                onMouseLeave={() => handleMouseOver('grade', false)}>
                {
                  headContent[0].isHover ? (headContent[0].order ? arrowDownButton('grade') : arrowUpButton('grade')) : (
                    <span>학년</span>)
                }
              </th>

              <th
                style={{width: '5%'}}
                className={'number-value'}
                onMouseOver={() => handleMouseOver('class', true)}
                onMouseLeave={() => handleMouseOver('class', false)}>
                {
                  headContent[1].isHover ? (headContent[1].order ? arrowDownButton('class') : arrowUpButton('class')) : (
                    <span>반</span>)
                }
              </th>

              <th
                style={{width: '5%'}}
                className={'number-value'}
                onMouseOver={() => handleMouseOver('number', true)}
                onMouseLeave={() => handleMouseOver('number', false)}>
                {
                  headContent[2].isHover ? (headContent[2].order ? arrowDownButton('number') : arrowUpButton('number')) : (
                    <span>번호</span>)
                }
              </th>

              <th
                style={{width: '8%'}}
                onMouseOver={() => handleMouseOver('name', true)}
                onMouseLeave={() => handleMouseOver('name', false)}>
                {
                  headContent[3].isHover ? (headContent[3].order ? arrowDownButton('name') : arrowUpButton('name')) : (
                    <span>이름</span>)
                }
              </th>

              <th
                style={{width: '6%'}}
                onMouseOver={() => handleMouseOver('division', true)}
                onMouseLeave={() => handleMouseOver('division', false)}>
                {
                  headContent[4].isHover ? (headContent[4].order ? arrowDownButton('division') : arrowUpButton('division')) : (
                    <span>구분</span>)
                }
              </th>

              <th
                style={{width: '48%'}}
                onMouseOver={() => handleMouseOver('regulate', true)}
                onMouseLeave={() => handleMouseOver('regulate', false)}>
                {
                  headContent[5].isHover ? (headContent[5].order ? arrowDownButton('regulate') : arrowUpButton('regulate')) : (
                    <span>발급항목</span>)
                }
              </th>

              <th onMouseOver={() => handleMouseOver('score', true)}
                  onMouseLeave={() => handleMouseOver('score', false)}>
                {
                  headContent[6].isHover ? (headContent[6].order ? arrowDownButton('score') : arrowUpButton('score')) : (
                    <span>점수</span>)
                }
              </th>

              <th
                style={{minWidth: '45px'}}
                onMouseOver={() => handleMouseOver('issuer', true)}
                onMouseLeave={() => handleMouseOver('issuer', false)}>
                {
                  headContent[7].isHover ? (headContent[7].order ? arrowDownButton('issuer') : arrowUpButton('issuer')) : (
                    <span>발급자</span>)
                }
              </th>

              <th
                onMouseOver={() => handleMouseOver('date', true)}
                onMouseLeave={() => handleMouseOver('date', false)}>
                {
                  headContent[8].isHover ? (headContent[8].order ? arrowDownButton('date') : arrowUpButton('date')) : (
                    <span>발급일</span>)
                }
              </th>

              </thead>

              <tbody>
              {
                isSearchOpen && (<tr className={cs('search-tr')}>
                  <td></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('grade', e.target.value)}
                             maxLength={1}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('class', e.target.value)}
                             maxLength={1}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('number', e.target.value)}
                             maxLength={1}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('name', e.target.value)}
                             maxLength={4}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('division', e.target.value)}
                             maxLength={3}/></td>
                  <td><input className={cs('search-input')}
                             onChange={(e) => changeTextValue('regulate', e.target.value)}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('score', e.target.value)}/>
                  </td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('issuer', e.target.value)}/>
                  </td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('date', e.target.value)}/>
                  </td>
                </tr>)
              }

              {Object.values(tableData).map((value: any, index: number) => (
                <tr key={index} className={cs('edit-tr')} onClick={() => editHistory(value.id)} style={{ backgroundColor: value.isChecked ? '#eff9ff' : ''}}>
                  <td><input type={"checkbox"} checked={value.isChecked} onClick={() => handelCheckButton(value.id)}/>
                  </td>
                  <td>{value.grade}</td>
                  <td>{value.class}</td>
                  <td>{value.number}</td>
                  <td>{value.name}</td>
                  <td className={cs(value.checked === '상점' ? 'plus' : 'minus')}>{value.checked}</td>
                  <td>{value.regulate}</td>
                  <td>{value.score}</td>
                  <td>{value.issuer}</td>
                  <td>{value.createdDate}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className={cs('button-container')}>
            <button style={{float: 'left', marginLeft: '0'}} className={cs('search-btn')}
                    onClick={searchHandler}>
              {
                isSearchOpen ? (<><MdSearchOff className={cs('icon', 'search-icon')}/> 검색 닫기</>) :
                  (<><MdSearch className={cs('icon', 'search-icon')}/> 검색하기</>)
              }
            </button>
            <button className={cs('print-btn')}><BsFillPrinterFill className={cs('icon')}/> 인쇄하기</button>
            <button className={cs('excel-btn')} onClick={() => ExcelDownloader(tableData, '발급내역', startDate, endDate)}>
              <RiFileExcel2Fill className={cs('icon')}/> 엑셀로 저장
            </button>
            <button className={cs('delete-btn')}><FiDelete className={cs('icon')}/> 선택삭제</button>
          </div>
        </div>
      </div>
    )
  }
}

export default History;