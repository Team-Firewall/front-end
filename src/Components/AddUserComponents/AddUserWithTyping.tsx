import React, { useState } from "react";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import axios from "axios";
import Swal from 'sweetalert2'
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import classNames from "classnames/bind";
import styles from '../../Style/AddUser/AddUserWithTyping.module.css'
import { FiUserPlus } from 'react-icons/fi'
import { AiOutlineCheck } from 'react-icons/ai'
import { CgPlayListAdd, CgPlayListRemove } from 'react-icons/cg'

const cs = classNames.bind(styles)

const AddUserWithTyping = () => {

  interface NewUser {
    index: number,
    position: number,
    grade: string,
    number: string,
    classNum: string,
    name: string,
    phoneNum: string,
    parentsPhoneNum1: string,
    parentsPhoneNum2: string,
    account: string,
    password: string,
    showPassword: boolean
  }

  const [newUserName, setNewUserName] = useState<string>()
  const [newPhoneNumber, setNewPhoneNumber] = useState<any>()
  const [newUserId, setNewUserId] = useState<string>()
  const [newUserPassword, setNewUserPassword] = useState<string>()
  const [newUserPosition, setNewUserPosition] = useState<number>()
  const [items, setItems] = useState([1, 2, 3]);
  const [newUserArray, setNewUserArray] = useState<NewUser[]>([])

  const isPresent = useIsPresent();

  const addNewUser = () => {
    setNewUserArray(oldValue => ([
      ...oldValue,
      {
        index: newUserArray.length,
        position: 3,
        grade: '',
        number: '',
        classNum: '',
        name: '',
        phoneNum: '',
        parentsPhoneNum1: '',
        parentsPhoneNum2: '',
        account: '',
        password: '',
        showPassword: false
      }]))
  }

  const modifyUserItem = (idx: number, value: string, classification: string) => {
    if (classification === 'grade') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          grade: value,
        } : it
      ))
    } else if (classification === 'position') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          position: Number(value),
        } : it
      ))
    } else if (classification === 'class') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          classNum: value,
        } : it
      ))
    } else if (classification === 'number') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          number: value,
        } : it
      ))
    } else if (classification === 'name') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          name: value,
        } : it
      ))
    } else if (classification === 'studentPhone') {
      const targetValue = phoneNumberAutoFormat(value)
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          phoneNum: targetValue,
        } : it
      ))
    } else if (classification === 'parentsPhone1') {
      const targetValue = phoneNumberAutoFormat(value)
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          parentsPhoneNum1: targetValue,
        } : it
      ))
    } else if (classification === 'parentsPhone2') {
      const targetValue = phoneNumberAutoFormat(value)
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          parentsPhoneNum2: targetValue,
        } : it
      ))
    } else if (classification === 'account') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          account: value,
        } : it
      ))
    } else if (classification === 'password') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === idx ? {
          ...it,
          password: value,
        } : it
      ))
    }
    console.log(newUserArray)
  }

  const removeUser = () => {
    if (newUserArray.length === 0) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e43019',
        html: '<span style="font-size: 30px; color: #000"> 삭제할 사용자가 없습니다. </span>',
        confirmButtonText: '확인',
        confirmButtonColor: '#159b99'
      })
    }
    setNewUserArray(current => (
      current.filter((newUser) => newUser.index !== newUserArray.length - 1)
    ))
    console.log(newUserArray)
  }

  const AddUserHandler = () => {
    if (newUserArray.length === 0) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e43019',
        html: '<span style="font-size: 30px; color: #000"> 추가할 사용자가 없습니다. </span>',
        confirmButtonText: '확인',
        confirmButtonColor: '#159b99'
      })
    }

    // let phoneNumber = newPhoneNumber.replace(/-/g, "")
    //
    // let data = {
    //   "name": newUserName,
    //   "phone": phoneNumber,
    //   "account": newUserId,
    //   "password": newUserPassword,
    //   "role": newUserPosition
    // }
    //
    // axios.post('http://localhost:3001/addUser', JSON.stringify(data), {
    //   headers: {"Content-Type": "application/json"}
    // }).then(() => Swal.fire({
    //   title: '유저 추가 완료',
    //   text: '유저 추가가 완료되었습니다.',
    //   icon: 'success',
    //   confirmButtonText: '확인'
    // }).then(() => {
    //   window.location.replace('/')
    // }))
    //   .catch(() => alert('ERROR'))
  }

  const handleShowPassword = (idx: number) => {
    setNewUserArray(newUserArray.map((it) =>
      it.index === idx ? {
        ...it,
        showPassword: !newUserArray[idx].showPassword,
      } : it
    ))
  }

  return (
    <div>
      <div className={'add-user-container'}
           style={{width: newUserArray.length < 1 ? '80%' : '100%', transition: '0.5s'}}>

        <div className={cs('table-container')} style={{ display: newUserArray.length === 0 ? 'table' : '' }}>

          {
            newUserArray.length === 0 && (
              <div className={cs('no-user-tag')}>
                <div className={cs('tag1')}>
                  <FiUserPlus className={cs('add-user-icon')}/> <span>사용자를 추가해 주세요.</span>
                </div>

                <div className={cs('tag2')}>
                  <div>
                    <AiOutlineCheck className={cs('check-icon')}/> <span>담당하는 학급이 있는 선생님은 [담임선생님] 권한을 선택해주세요.</span>
                  </div>
                  <div className={cs('tag3')}>
                    <AiOutlineCheck className={cs('check-icon')}/> <span>담임선생님 선택 시, 담당하는 학급의 학년과 반을 입력해주세요.</span>
                  </div>
                </div>
              </div>
            )
          }

          {
            newUserArray.length > 0 && (
              <table cellPadding={0} className={cs('user-table')}>
                <thead>
                <tr>
                  <th style={{ borderTopLeftRadius: '5px', width: '120px' }}>권한</th>
                  <th style={{ width: '50px' }}>학년</th>
                  <th style={{ width: '50px' }}>반</th>
                  <th style={{ width: '50px' }}>번호</th>
                  <th style={{ width: '100px' }}>이름</th>
                  <th>전화번호</th>
                  <th>학부모1 전화번호</th>
                  <th>학부모2 전화번호</th>
                  <th style={{ width: '70px' }}>아이디</th>
                  <th style={{ borderTopRightRadius: '5px', width: '150px' }}>비밀번호</th>
                </tr>
                </thead>
                <tbody>
                <AnimatePresence>
                  {Object.values(newUserArray).map((value: any, index: number) => (
                    <motion.tr
                      layout
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{opacity: {duration: 0.2}}}
                      style={{
                        position: isPresent ? "relative" : "absolute",
                        display: isPresent ? "table-row" : "flex",
                        alignItems: isPresent ? "" : "center",
                      }}
                      className={cs('user-table-tr')}
                      key={index}
                    >
                      <td>
                        <select
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'position')}
                          value={newUserArray[index].position}
                          style={{height: '30px'}}
                        >
                          <option value={3}>고등학생</option>
                          <option value={4}>중학생</option>
                          <option value={1}>선생님(고)</option>
                          <option value={2}>선생님(중)</option>
                          <option value={5}>담임선생님(고)</option>
                          <option value={6}>담임선생님(중)</option>
                          <option value={0}>관리자</option>
                        </select>
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'grade')}
                          value={newUserArray[index].grade}
                          type={'number'}
                          min={1}
                          max={3}
                          placeholder={'학년'}
                          className={cs('number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'class')}
                          value={newUserArray[index].classNum}
                          type={'number'}
                          min={1}
                          max={4}
                          placeholder={'반'}
                          className={cs('number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'number')}
                          value={newUserArray[index].number}
                          type={'number'}
                          min={1}
                          max={22}
                          placeholder={'번호'}
                          className={cs('number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'name')}
                          value={newUserArray[index].name}
                          type={'text'}
                          maxLength={5}
                          placeholder={'이름'}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) => modifyUserItem(index, e.target.value, 'studentPhone')}
                          value={newUserArray[index].phoneNum}
                          type={'tel'}
                          placeholder={'학생 전화번호'}
                          maxLength={13}
                          className={cs('phone-number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) => modifyUserItem(index, e.target.value, 'parentsPhone1')}
                          value={newUserArray[index].parentsPhoneNum1}
                          type={'tel'}
                          placeholder={'학부모1 전화번호'}
                          maxLength={13}
                          className={cs('phone-number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) => modifyUserItem(index, e.target.value, 'parentsPhone2')}
                          value={newUserArray[index].parentsPhoneNum2}
                          type={'tel'}
                          placeholder={'학부모2 전화번호'}
                          maxLength={13}
                          className={cs('phone-number-input')}
                        />
                      </td>

                      <td className="w-1/3">
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'account')}
                          value={newUserArray[index].account}
                          type={'text'}
                          maxLength={10}
                          placeholder={'아이디 / 학번'}
                        />
                      </td>
                      <td className="w-1/3">
                        <div>
                        <input
                          onChange={(e) =>
                            modifyUserItem(index, e.target.value, 'password')}
                          value={newUserArray[index].password}
                          type={newUserArray[index].showPassword ? "text" : "password"}
                          maxLength={15}
                          placeholder={'4자리 이상 입력'}
                          className={cs('password-input')}
                        />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                </tbody>
              </table>
            )
          }
        </div>

        <div>
          <div className={cs('button-container')}>
            <button onClick={addNewUser} className={cs('add-row-button')}>
              <CgPlayListAdd className={cs('list-icon')}/> <span>행 추가</span></button>
            <button onClick={removeUser} className={cs('remove-row-button')}>
              <CgPlayListRemove className={cs('list-icon')}/> <span>행 제거</span></button>

            <button onClick={AddUserHandler} className={cs('add-user-button')}>
              <FiUserPlus className={cs('add-user-icon2')}/> <span>사용자 추가</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserWithTyping

