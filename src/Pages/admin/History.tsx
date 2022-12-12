import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import {BsArrowUp ,BsArrowDown} from 'react-icons/bs'

const cs = classNames.bind(styles)

interface dataValue {
  id: number,
  class: number,
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
  const arrowUpButton = () => {
    return (<button className={'arrowUpButton'}><BsArrowUp className={'arrow-icon'}/></button>)
  }

  const arrowDownButton = () => {
    return (<button><BsArrowDown/></button>)
  }

  const [data, setData] = useState<dataValue[]>([])
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false)

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

        <div className={cs('search-bar')}></div>
        <button onClick={() => sortArray('asc')}>ASC</button>
        <button onClick={() => sortArray('desc')}>DESC</button>
        <div className={'container'}>
          <div className={'management-table-container'}>
            <table>
              <thead>
              <th><input type={"checkbox"} onClick={(e) => checkAllButton(e.currentTarget.checked)}/></th>
              <th onMouseOver={() => setIsMouseOver(true)}
                  onMouseLeave={() => setIsMouseOver(false)}
              >
                {
                  isMouseOver ? (arrowUpButton()) : (<span>학년</span>)
                }
              </th>
              <th>반</th>
              <th>번호</th>
              <th>이름</th>
              <th>구분</th>
              <th>발급항목</th>
              <th>점수</th>
              <th>발급자</th>
              <th>발급일</th>
              </thead>

              <tbody>
              {Object.values(data).map((value: any, index: number) => (
                <tr key={index} className={cs('edit-tr')} onClick={() => editHistory(value.id)}>
                  <td><input type={"checkbox"} checked={value.isChecked} onClick={() => handelCheckButton(value.id)}/></td>
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