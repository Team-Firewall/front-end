import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility'
import classNames from "classnames/bind"
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import styles from '../Style/Login.module.css'
import { AiFillExclamationCircle } from 'react-icons/ai'
import axios from "axios"
import { getItemWithExpireTime, setItemWithExpireTime } from "../utils/ControllToken"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const cs = classNames.bind(styles)

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export default function InputAdornments() {
  const navigate = useNavigate()
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<string>('')

  const login = () => {
    setIsPasswordCorrect('loading')

    let data = {
      "account": idValues.password,
      "password": passwordValues.password
    }

    setTimeout(() => {
      axios.post('http://localhost:3001/sign/in', JSON.stringify(data), {
        headers: {"Content-Type": "application/json"}
      }).then((res: any) => {
        if (res.data.success) {
          setItemWithExpireTime(res.data.token)
          let token: any = getItemWithExpireTime()
          token = jwt_decode(token)
          let position: number = token.position
          if (position === 0 || position === 2) {
            navigate('/points')
          } else if (position === 1 || position == 3 || position === 4) {
            navigate('/admin/issuance')
          }
        }
      }).catch((err) => {
        setIsPasswordCorrect('error')
      })
    }, 400);
  }

  const [passwordValues, setPasswordValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const [idValues, setIdValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValues({...passwordValues, [prop]: event.target.value});
    };

  const handleChangeID =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setIdValues({...idValues, [prop]: event.target.value});
    };

  const handleClickShowPassword = () => {
    setPasswordValues({
      ...passwordValues,
      showPassword: !passwordValues.showPassword,
    });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box>
      <div className={cs('input-container')}>

        <FormControl sx={{m: 1, width: '350px'}} variant="outlined"
          onChange={handleChangeID('password')}
          onKeyPress={(e) => {if (e.key === 'Enter') login()}}
        >
          <InputLabel htmlFor="outlined-adornment-password">학번</InputLabel>
          <OutlinedInput
            label="학번"
          />
        </FormControl>

        <div className={cs('exclamation-phrases')}>
          <AiFillExclamationCircle style={{marginBottom: '-2.5px', color: '#f00', fontSize: '14px'}}/>
          <span>아이디 또는 학번이 기억나지 않는다면 선생님께 문의해주세요.</span>
        </div>

        <FormControl sx={{m: 1, width: '350px', marginTop: '25px'}} variant="outlined"
           onKeyPress={(e) => {if (e.key === 'Enter') login()}}
        >
          <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={passwordValues.showPassword ? 'text' : 'password'}
            value={passwordValues.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {passwordValues.showPassword ? <VisibilityOff/> : <Visibility/>}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>


        <div className={cs('exclamation-phrases')}>
          {
            isPasswordCorrect === 'error' && (
              <span style={{color: '#f00'}}>학번 또는 비밀번호가 올바르지 않습니다.</span>
            )
          }
          {
            isPasswordCorrect === 'loading' && (
              <span style={{color: '#043db2'}}>잠시만 기다려주세요..</span>
            )
          }
        </div>

        <button className={cs('login-btn')} onClick={login}>로그인</button>
      </div>
    </Box>
  );
}
