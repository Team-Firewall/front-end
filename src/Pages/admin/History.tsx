import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'

const cs = classNames.bind(styles)

interface dataValue {
  id: number,
  userId: number,
  regulateId: number,
  reason: string,
  issuer: string,
  createdAt: string,
  updatedAt: string,
  regulate: {
    id: number,
    checked: string,
    division: string,
    regulate: string,
    score: number
  }
}

const History = () => {
  const [data, setData] = useState<dataValue[]>([])
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false)

  useEffect(() => {
    fetch('http://localhost:3001/v1/point')
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  const sortArray = (sortDivision: string) => {
    if (sortDivision === 'desc') {
      data.sort((a: any, b: any) => (a.createdAt < b.createdAt) ? 1 : -1)
    } else if (sortDivision === 'asc') {
      data.sort((a: any, b: any) => (a.createdAt > b.createdAt) ? 1 : -1)
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
              <th onMouseOver={() => setIsMouseOver(true)}
                  onMouseLeave={() => setIsMouseOver(false)}
              >
                {
                  isMouseOver ? (<button>hi</button>) : (<span>학년</span>)
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
                  <td>{value.id}</td>
                  <td>{value.userId}</td>
                  <td>{value.regulateId}</td>
                  <td>{value.issuer}</td>
                  <td className={cs(value.regulate.checked === '상점' ? 'plus' : 'minus')}>{value.regulate.checked}</td>
                  <td>{value.regulate.regulate}</td>
                  <td>{value.regulate.score}</td>
                  <td>{value.issuer}</td>
                  <td>{value.createdAt}</td>
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