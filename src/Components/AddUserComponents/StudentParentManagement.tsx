import React, { useState } from 'react'
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Loading from "../Loading";
import styles from '../../Style/AddUser/StudentManagement.module.css'
import classNames from "classnames/bind";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import { IoMdClose, IoMdCheckmark } from 'react-icons/io'
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';

const cs = classNames.bind(styles)

const StudentParentManagement = () => {
  interface changePasswordType {
    amount: string;
    password: string;
    weight: string;
    weightRange: string;
    showPassword: boolean;
    userid: number,
    username: string,
  }

  const {data, error} = useSWR(`${process.env.REACT_APP_API_URL}/v1/user`, fetcher)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false)
  const [values, setValues] = useState<changePasswordType>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
    userid: 0,
    username: ''
  });

  const handleBoxOpen = (id: number, username: string) => {
    setValues(
      {
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        userid: id,
        username: username
      })
    setIsChangePasswordOpen(true)
  }

  const handleChangePasswordClose = () => {
    setValues(
      {
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        userid: 0,
        username: ''
      })
    setIsChangePasswordOpen(false)
  }

  const handleChange =
    (prop: keyof changePasswordType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values, [prop]: event.target.value});
      console.log(values)
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

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
              <th>아이디</th>
              <th>학년</th>
              <th>반</th>
              <th>번호</th>
              <th>이름</th>
              <th>학생 전화번호</th>
              <th>학부모 전화번호1</th>
              <th>학부모 전화번호2</th>
              </thead>
              <tbody>
              {Object.values(data).map((value: any, index: number) => (
                <tr key={index}>
                  <td>{value.permission === 3 ? '고등학생' : '중학생'}</td>
                  <td>{value.account}</td>
                  <td>{value.grade}</td>
                  <td>{value.classNum}</td>
                  <td>{value.number}</td>
                  <td>{value.name}</td>
                  <td>{phoneNumberAutoFormat(value.phone)}</td>
                  <td>{value.parents[0]?.phone ? phoneNumberAutoFormat(value.parents[0].phone) : '-'}</td>
                  <td>{value.parents[1]?.phone ? phoneNumberAutoFormat(value.parents[1].phone) : '-'}</td>
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