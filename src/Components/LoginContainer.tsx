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
      axios.post(`${process.env.REACT_APP_API_URL}/sign/in`, JSON.stringify(data), {
        headers: {"Content-Type": "application/json"}
      }).then((res: any) => {
        if (res.data.success) {
          setItemWithExpireTime(res.data.token)
          let token: any = getItemWithExpireTime()
          token = jwt_decode(token)
          let permission: number = token.permission
          if (permission === 0 || permission === 1 || permission === 2) {
            navigate('/admin/issuance')
          } else if (permission == 3 || permission === 4) {
            navigate('/points')
          }
        }
      }).catch(() => setIsPasswordCorrect('error'))
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

        <FormControl sx={{m: 1, width: '100%', marginLeft: '0'}} variant="outlined"
          onChange={handleChangeID('password')}
          onKeyPress={(e) => {if (e.key === 'Enter') login()}}
        >
          <InputLabel htmlFor="outlined-adornment-password">??????</InputLabel>
          <OutlinedInput
            label="??????"
          />
        </FormControl>

        <div className={cs('exclamation-phrases')}>
          <AiFillExclamationCircle style={{marginBottom: '-2.5px', color: '#f00', fontSize: '14px'}}/>
          <span>????????? ?????? ????????? ???????????? ???????????? ???????????? ??????????????????.</span>
        </div>

        <FormControl sx={{m: 1, width: '100%', marginTop: '25px', marginLeft: '0'}} variant="outlined"
           onKeyPress={(e) => {if (e.key === 'Enter') login()}}
        >
          <InputLabel htmlFor="outlined-adornment-password">????????????</InputLabel>
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
              <span style={{color: '#f00'}}>?????? ?????? ??????????????? ???????????? ????????????.</span>
            )
          }
          {
            isPasswordCorrect === 'loading' && (
              <span style={{color: '#043db2'}}>????????? ??????????????????..</span>
            )
          }
        </div>

        <button className={cs('login-btn')} onClick={login}>?????????</button>
      </div>
    </Box>
  );
}
