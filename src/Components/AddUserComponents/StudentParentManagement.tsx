import React, { useState } from 'react'
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Loading from "../Loading";
import styles from '../../Style/AddUser/StudentManagement.module.css'
import classNames from "classnames/bind";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import { GrPowerReset, GrCheckmark, GrClose } from 'react-icons/gr'

const cs = classNames.bind(styles)

const StudentParentManagement = () => {
  interface changePasswordType {
    userid: number,
    username: string,
    newPassword: string,
    checkNewPassword: string
  }

  const {data, error} = useSWR('http://localhost:3001/v1/user', fetcher)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false)
  const [changePasswordOption, setChangePasswordOption] = useState<changePasswordType[]>([])

  const handleBoxOpen = (id: number, username: string) => {
    setChangePasswordOption([
      {
        userid: id,
        username: username,
        newPassword: '',
        checkNewPassword: ''
      }])
    setIsChangePasswordOpen(true)

    console.log(changePasswordOption)
  }

  const handleChangePasswordClose = () => {
    setIsChangePasswordOpen(false)
  }

  if (error) {
    return <h1>ERROR</h1>
  } else if (!data) {
    return <Loading/>
  } else {
    return (
      <div>
        <div className={'add-user-container'}>
          <div className={'management-table-container'}>
            <table>
              <thead>
              <th>구분</th>
              <th>학년</th>
              <th>반</th>
              <th>번호</th>
              <th>이름</th>
              <th>학생 전화번호</th>
              <th>학부모 전화번호1</th>
              <th>학부모 전화번호2</th>
              <th>비밀번호 초기화</th>
              </thead>
              <tbody>
              {Object.values(data).map((value: any, index: number) => (
                <tr key={index}>
                  <td>{value.position === 3 ? '고등학생' : '중학생'}</td>
                  <td>{value.grade}</td>
                  <td>{value.classNum}</td>
                  <td>{value.number}</td>
                  <td>{value.name}</td>
                  <td>{phoneNumberAutoFormat(value.phone)}</td>
                  <td>{value.parents[0]?.phone ? phoneNumberAutoFormat(value.parents[0].phone) : '-'}</td>
                  <td>{value.parents[1]?.phone ? phoneNumberAutoFormat(value.parents[1].phone) : '-'}</td>
                  <td style={{width: '20vw'}}>
                    {
                      isChangePasswordOpen === false &&
                      (<button onClick={() => handleBoxOpen(value.id, value.name)}><GrPowerReset/> 초기화</button>)
                    }
                    {
                      isChangePasswordOpen === true && changePasswordOption[0].userid === value.id && (
                        <>
                          <input/>
                          <button onClick={handleChangePasswordClose}><GrClose/></button>
                          <button><GrCheckmark/></button>
                        </>
                      )
                    }
                  </td>
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

export default StudentParentManagement