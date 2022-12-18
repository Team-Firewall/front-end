import React, { forwardRef, useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'
import useThrottle from '../../utils/useThrottle'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/esm/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FiDelete } from 'react-icons/fi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { BsFillPrinterFill } from 'react-icons/bs'

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

  const changeOrder = () => {
    setOrder(!order)

    if (order) {
      data.sort((a: any, b: any) => (a.createdDate > b.createdDate) ? 1 : -1)
    } else {
      data.sort((a: any, b: any) => (a.createdDate < b.createdDate) ? 1 : -1)
    }

    setData([...data])
  }

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

  const [data, setData] = useState<dataValue[]>([])

  const [headContent, setHeadContent] = useState([
    {'title': 'grade', 'isHover': false, 'order': true},
    {'title': 'class', 'isHover': false, 'order': true},
    {'title': 'number', 'isHover': false, 'order': true},
    {'title': 'name', 'isHover': false, 'order': true},
    {'title': 'division', 'isHover': false, 'order': true},
    {'title': 'regulate', 'isHover': false, 'order': true},
    {'title': 'score', 'isHover': false, 'order': true},
    {'title': 'issuer', 'isHover': false, 'order': true},
    {'title': 'date', 'isHover': false, 'order': true}
  ])

  const [order, setOrder] = useState<boolean>(false)
  const [text, setText] = useState<string>('');
  const throttledText = useThrottle(text);

  useEffect(() => {
    fetch('http://localhost:3001/v1/point')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data.map((v: any) => ({...v, isChecked: false})))
      })
  }, [])

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
    setData(data.map((v: dataValue) =>
      v.id ? {...v, isChecked: isClicked ? true : false} : v
    ))
  }

  const handelCheckButton = (idx: number) => {
    setData(data.map((v: dataValue) =>
      v.id === idx ? {...v, isChecked: !v.isChecked} : v
    ))
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

  const editHistory = (id: number) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        console.log(data[i])
      }
    }
  }

  if (!data) {
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

        <div className={cs('search-bar')}>
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
            <div className={'date-hyphen'}>-</div>
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

            <div className={'search-btn'}>
              <button>조회</button>
            </div>

          </div>


          {/*<input onChange={(e) => setText(e.target.value)}/>*/}
          {/*<div>{throttledText}</div>*/}
        </div>

        <div className={'container'} style={{marginTop: '1vh'}}>
          <div className={'management-table-container'} style={{height: '90%'}}>
            <table>
              <thead>
              <th><input type={"checkbox"} onClick={(e) => checkAllButton(e.currentTarget.checked)}/></th>

              <th
                className={'number-value'}
                onMouseOver={() => handleMouseOver('grade', true)}
                onMouseLeave={() => handleMouseOver('grade', false)}>
                {
                  headContent[0].isHover ? (headContent[0].order ? arrowDownButton('grade') : arrowUpButton('grade')) : (
                    <span>학년</span>)
                }
              </th>

              <th
                className={'number-value'}
                onMouseOver={() => handleMouseOver('class', true)}
                onMouseLeave={() => handleMouseOver('class', false)}>
                {
                  headContent[1].isHover ? (headContent[1].order ? arrowDownButton('class') : arrowUpButton('class')) : (
                    <span>반</span>)
                }
              </th>

              <th
                className={'number-value'}
                onMouseOver={() => handleMouseOver('number', true)}
                onMouseLeave={() => handleMouseOver('number', false)}>
                {
                  headContent[2].isHover ? (headContent[2].order ? arrowDownButton('number') : arrowUpButton('number')) : (
                    <span>번호</span>)
                }
              </th>

              <th
                onMouseOver={() => handleMouseOver('name', true)}
                onMouseLeave={() => handleMouseOver('name', false)}>
                {
                  headContent[3].isHover ? (headContent[3].order ? arrowDownButton('name') : arrowUpButton('name')) : (
                    <span>이름</span>)
                }
              </th>

              <th
                onMouseOver={() => handleMouseOver('division', true)}
                onMouseLeave={() => handleMouseOver('division', false)}>
                {
                  headContent[4].isHover ? (headContent[4].order ? arrowDownButton('division') : arrowUpButton('division')) : (
                    <span>구분</span>)
                }
              </th>

              <th
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
              {Object.values(data).map((value: any, index: number) => (
                <tr key={index} className={cs('edit-tr')} onClick={() => editHistory(value.id)}>
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
            <button className={cs('print-btn')}><BsFillPrinterFill className={cs('icon')}/> 인쇄하기</button>
            <button className={cs('excel-btn')}><RiFileExcel2Fill className={cs('icon')}/> 엑셀로 저장</button>
            <button className={cs('delete-btn')}><FiDelete className={cs('icon')}/> 선택삭제</button>
          </div>
        </div>
      </div>
    )
  }
}

export default History;