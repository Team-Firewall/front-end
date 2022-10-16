import React, { useState } from 'react'
import styles from '../../Style/Components.module.css'
import classNames from "classnames/bind";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const cs = classNames.bind(styles)

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [checkPassword, setCheckPassword] = useState<string>('')

  return (
    <div className={cs('change-password-container')}>

      <div className={cs('change-password-heading')}>비밀번호 변경</div>

      <div className={cs('input-box-container')}>
        <Box>
          <div className={cs('change-password-box')}>
            <TextField
              id="demo-helper-text-aligned"
              label="현재 비밀번호"
              className={cs('change-password-field')}
              type={'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {
              <div className={cs('error-message')}>비밀번호가 일치하지 않습니다.</div>
            }
          </div>

          <div className={cs('change-password-box')}>
            <TextField
              id="demo-helper-text-aligned"
              label="새 비밀번호"
              className={cs('change-password-field')}
              type={'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {
              <div className={cs('error-message')}>비밀번호는 4자 이상이어야 합니다.</div>
            }
          </div>

          <div className={cs('change-password-box')}>
            <TextField
              id="demo-helper-text-aligned"
              label="비밀번호 다시 입력"
              className={cs('change-password-field')}
              type={'password'}
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
            />
            {
              <div className={cs('error-message')}>새 비밀번호와 일치하지 않습니다.</div>
            }
          </div>

          <button className=
            {cs(currentPassword.length > 3 && newPassword.length > 3 && checkPassword.length > 3 ?
            'change-password-btn-checked' : 'change-password-btn-notChecked', 'change-password-btn')}>
            확인
          </button>

        </Box>
      </div>

    </div>
  )
}

export default ChangePassword