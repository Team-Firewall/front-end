import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'
import useThrottle from '../../utils/useThrottle'
import ReactTooltip from 'react-tooltip'

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
      data.sort((a: dataValue, b: dataValue) => asc ? (a.name < b.name) ? 1 : -1 : (a.name > b.name) ? 1 : -1)
    } else if (title === 'division') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.division < b.division) ? 1 : -1 : (a.division > b.division) ? 1 : -1)
    } else if (title === 'regulate') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.regulate < b.regulate) ? 1 : -1 : (a.regulate > b.regulate) ? 1 : -1)
    } else if (title === 'score') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.score < b.score) ? 1 : -1 : (a.score > b.score) ? 1 : -1)
    } else if (title === 'issuer') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.issuer < b.issuer) ? 1 : -1 : (a.issuer > b.issuer) ? 1 : -1)
    } else if (title === 'date') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.createdDate < b.createdDate) ? 1 : -1 : (a.createdDate > b.createdDate) ? 1 : -1)
    }

    setData([...data])

    console.log(headContent)
  }

  const sortArray = (sortDivision: string) => {
    if (sortDivision === 'desc') {
      data.sort((a: any, b: any) => (a.createdDate < b.createdDate) ? 1 : -1)
    } else if (sortDivision === 'asc') {
      data.sort((a: any, b: any) => (a.createdDate > b.createdDate) ? 1 : -1)
    }

    setData([...data])
    console.log(data)
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
          <input onChange={(e) => setText(e.target.value)}/>
          <div>{throttledText}</div>
        </div>
        <div className={'container'}>
          <div className={'management-table-container'}>
            <table>
              <thead>
              <th><input type={"checkbox"} onClick={(e) => checkAllButton(e.currentTarget.checked)}/></th>

              <th
                  className={'number-value'}
                  onMouseOver={() => handleMouseOver('grade', true)}
                  onMouseLeave={() => handleMouseOver('grade', false)}>
                {
                  headContent[0].isHover ? (headContent[0].order ? arrowDownButton('grade') : arrowUpButton('grade')) : (<span>학년</span>)
                }
              </th>
              <th
                  className={'number-value'}
                  onMouseOver={() => handleMouseOver('class', true)}
                  onMouseLeave={() => handleMouseOver('class', false)}>
                {
                  headContent[1].isHover ? (headContent[1].order ? arrowDownButton('class') : arrowUpButton('class')) : (<span>반</span>)
                }
              </th>
              <th className={'number-value'}
              >번호</th>
              <th>이름</th>
              <th>구분</th>
              <th>발급항목</th>
              <th onMouseOver={() => handleMouseOver('score', true)}
                  onMouseLeave={() => handleMouseOver('score', false)}>
                {
                  headContent[6].isHover ? (headContent[6].order ? arrowDownButton('score') : arrowUpButton('score')) : (<span>점수</span>)
                }
              </th>
              <th>발급자</th>
              <th>발급일</th>
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
        </div>
      </div>
    )
  }
}

export default History;