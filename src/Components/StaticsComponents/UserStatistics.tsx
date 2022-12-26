import React, { useEffect, useState } from 'react'
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Loading from "../Loading";

interface userTotalType {
  userId: number,
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

  const [headContent, setHeadContent] = useState([
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
        setResponseData(data)
        setUserTotalValue(data)
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
      String(value.grade).includes(headContent[0].textValue) &&
      String(value.class).includes(headContent[1].textValue) &&
      String(value.number).includes(headContent[2].textValue) &&
      value.name.includes(headContent[3].textValue) &&
      String(value.bonus).includes(headContent[4].textValue) &&
      String(value.minus).includes(headContent[5].textValue) &&
      String(value.total).includes(headContent[6].textValue)
    )))
  }, [headContent])

  if (isError) return <h1>ERROR</h1>
  else if (isLoading) return <Loading/>
  else {
    return (
      <div className={'container'} style={{width: '100%', height: '70vh'}}>
        <div className={'management-table-container'}>
          <table>
            <thead>
            <th>학년</th>
            <th>반</th>
            <th>번호</th>
            <th>이름</th>
            <th>상점</th>
            <th>벌점</th>
            <th>누계</th>
            </thead>

            <tbody>
            {
              isSearchOpen && (<tr className={'search-tr'}>
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
              <tr key={i}>
                <td>{v.grade}</td>
                <td>{v.class}</td>
                <td>{v.number}</td>
                <td>{v.name}</td>
                <td>{v.bonus}</td>
                <td>{v.minus}</td>
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