import React, { useState } from 'react'
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Loading from "../Loading";
import styles from '../../Style/AddUser/StudentManagement.module.css'
import classNames from "classnames/bind";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import { GrPowerReset, GrCheckmark, GrClose } from 'react-icons/gr'
import { IoMdClose, IoMdCheckmark } from 'react-icons/io'
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BiReset } from 'react-icons/bi'
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

  const {data, error} = useSWR('http://localhost:3001/v1/user', fetcher)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false)
  // const [changePasswordOption, setChangePasswordOption] = useState<changePasswordType[]>([])
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
                      (<button onClick={() => handleBoxOpen(value.id, value.name)} className={'password-reset-btn'}><LockResetIcon
                        style={{color: '#267fbc', marginBottom: '-3px', fontSize: '16.5px'}}/> <span>초기화</span></button>)
                    }
                    {
                      isChangePasswordOpen === true && values.userid === value.id && (
                        <>
                          <FormControl sx={{m: 1, width: '60%'}} variant="standard">
                            {/*<InputLabel htmlFor="standard-adornment-password">새 비밀번호 입력</InputLabel>*/}
                            <Input
                              id="standard-adornment-password"
                              type={values.showPassword ? 'text' : 'password'}
                              value={values.password}
                              placeholder={'새 비밀번호 입력'}
                              onChange={handleChange('password')}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                  </IconButton>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                          <div className={'change-password-button-container'}>
                            <button onClick={handleChangePasswordClose} className={'close-button'}>
                              <IoMdClose className={'change-password-icon'}/></button>
                            <button className={'check-button'}><IoMdCheckmark className={'change-password-icon'}/>
                            </button>
                          </div>
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