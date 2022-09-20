import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import classNames from "classnames/bind"
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styles from '../Style/Login.module.css'
import { AiFillExclamationCircle } from 'react-icons/ai'

const cs = classNames.bind(styles)

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export default function InputAdornments() {
  const [values, setValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
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

  return (
    <Box>
      <div className={cs('input-container')}>

        <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">학번</InputLabel>
          <OutlinedInput
            label="학번"
          />
        </FormControl>

        <div className={cs('exclamation-phrases')}>
          <AiFillExclamationCircle style={{ marginBottom: '-2.5px', color: '#f00', fontSize: '14px' }}/>
          <span>아이디 또는 학번이 기억나지 않는다면 선생님께 문의해주세요.</span>
        </div>

        <FormControl sx={{ m: 1, width: '350px', marginTop: '25px' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <div className={cs('exclamation-phrases')}>
          <span style={{ color: '#f00' }}>학번 또는 비밀번호가 올바르지 않습니다.</span>
        </div>

        <button className={cs('login-btn')}>로그인</button>

      </div>
    </Box>
  );
}
