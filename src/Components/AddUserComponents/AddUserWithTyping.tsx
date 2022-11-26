import React, { FormEvent, useState } from "react";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import axios from "axios";
import Swal from 'sweetalert2'
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import classNames from "classnames/bind";
import styles from '../../Style/AddUser/AddUserWithTyping.module.css'
import { FiUserPlus } from 'react-icons/fi'
import { CgPlayListAdd, CgPlayListRemove } from 'react-icons/cg'
import { AiFillEye, AiFillEyeInvisible, AiOutlineCheck } from 'react-icons/ai'

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
  }

  interface insertUser {
    role: number,
    grade: number,
    number: number,
    classNum: number,
    name: string,
    phone: string,
    parentsPhoneNum1: string,
    parentsPhoneNum2: string,
    account: string,
    password: string,
  }

  const [newUserArray, setNewUserArray] = useState<NewUser[]>([])
  const [insertUserArray, setInsertUserArray] = useState<insertUser[]>([])
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isInputFilled, setIsInputFilled] = useState<boolean>(false)
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
      }]))
  }

  const modifyUserItem = (idx: number, value: string, classification: string) => {
    userNormalization()

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
      if (showPassword) {
        setShowPassword(false)
      } else {
        setNewUserArray(newUserArray.map((it) =>
          it.index === idx ? {
            ...it,
            password: value,
          } : it
        ))
      }
    }
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

  const userNormalization = () => {
    setInsertUserArray([])
    for (let i = 0; i < newUserArray.length; i++) {
      if (newUserArray[i].position === 1 || newUserArray[i].position === 2 || newUserArray[i].position === 0) {
        setInsertUserArray(oldValue => ([
          ...oldValue,
          {
            role: newUserArray[i].position,
            grade: 0,
            number: 0,
            classNum: 0,
            name: newUserArray[i].name,
            phone: newUserArray[i].phoneNum.replace(/-/g, ''),
            parentsPhoneNum1: '',
            parentsPhoneNum2: '',
            account: newUserArray[i].account,
            password: newUserArray[i].password,
          }]))
      } else if (newUserArray[i].position === 5 || newUserArray[i].position === 6) {
        setInsertUserArray(oldValue => ([
          ...oldValue,
          {
            role: newUserArray[i].position === 5 ? 1 : 2,
            grade: Number(newUserArray[i].grade),
            number: 0,
            classNum: Number(newUserArray[i].classNum),
            name: newUserArray[i].name,
            phone: newUserArray[i].phoneNum.replace(/-/g, ''),
            parentsPhoneNum1: '',
            parentsPhoneNum2: '',
            account: newUserArray[i].account,
            password: newUserArray[i].password,
          }]))
      } else {
        setInsertUserArray(oldValue => ([
          ...oldValue,
          {
            role: newUserArray[i].position,
            grade: Number(newUserArray[i].grade),
            number: Number(newUserArray[i].number),
            classNum: Number(newUserArray[i].classNum),
            name: newUserArray[i].name,
            phone: newUserArray[i].phoneNum.replace(/-/g, ''),
            parentsPhoneNum1: newUserArray[i].parentsPhoneNum1.replace(/-/g, ''),
            parentsPhoneNum2: newUserArray[i].parentsPhoneNum2.replace(/-/g, ''),
            account: newUserArray[i].account,
            password: newUserArray[i].password,
          }]))
      }
    }

    console.log(insertUserArray)
  }

  const AddUserHandler = (e: FormEvent) => {
    e.preventDefault()

    if (newUserArray.length === 0) {
      Swal.fire({
        icon: 'error',
        iconColor: '#e43019',
        html: '<span style="font-size: 30px; color: #000"> 추가할 사용자가 없습니다. </span>',
        confirmButtonText: '확인',
        confirmButtonColor: '#159b99'
      })
    } else {
      Swal.fire({
        text: `총 ${newUserArray.length}명의 사용자를 추가하시겠습니까?`,
        icon: 'question',
        iconColor: '#b90e7d',
        showCancelButton: true,
        cancelButtonColor: '#dc3545',
        confirmButtonColor: '#28a745',
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      }).then((res) => {
        if (res.isConfirmed) {
          axios.post('http://localhost:3001/addUserMany', JSON.stringify(insertUserArray), {
            headers: {"Content-Type": "application/json"}
          }).then((res) => {
            console.log('this is response', res.data)
            if (res.data.success) {
              Swal.fire({
                title: '학생 추가 완료',
                text: '학생 추가가 완료되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }).then(() => {
                window.location.reload()
              })
            }
          })
        }
      })
    }
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }


  return (
    <div>
      <form onSubmit={AddUserHandler}>
        <div className={'add-user-container'}>

          <div className={cs('table-container')} style={{display: newUserArray.length === 0 ? 'table' : ''}}>

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
                    <th style={{borderTopLeftRadius: '5px', width: '120px'}}>권한</th>
                    <th style={{width: '50px'}}>학년</th>
                    <th style={{width: '50px'}}>반</th>
                    <th style={{width: '50px'}}>번호</th>
                    <th style={{width: '100px'}}>이름</th>
                    <th>전화번호</th>
                    <th>학부모1 전화번호</th>
                    <th>학부모2 전화번호</th>
                    <th>아이디</th>
                    <th style={{borderTopRightRadius: '5px'}}>비밀번호</th>
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

                        <td>
                          {
                            newUserArray[index].position === 1 || newUserArray[index].position === 2 || newUserArray[index].position === 0 ?
                              (<div className={cs('none-value-tag')}>-</div>) :
                              (
                                <input
                                  onChange={(e) =>
                                    modifyUserItem(index, e.target.value, 'grade')}
                                  value={newUserArray[index].grade}
                                  type={'number'}
                                  min={1}
                                  max={3}
                                  placeholder={'학년'}
                                  required={true}
                                  className={cs('number-input')}
                                />
                              )
                          }
                        </td>

                        <td>
                          {
                            newUserArray[index].position === 1 || newUserArray[index].position === 2 || newUserArray[index].position === 0 ?
                              (<div className={cs('none-value-tag')}>-</div>) :
                              (
                                <input
                                  onChange={(e) =>
                                    modifyUserItem(index, e.target.value, 'class')}
                                  value={newUserArray[index].classNum}
                                  type={'number'}
                                  min={1}
                                  max={4}
                                  placeholder={'반'}
                                  required={true}
                                  className={cs('number-input')}
                                />
                              )
                          }

                        </td>

                        <td>
                          {
                            newUserArray[index].position === 3 || newUserArray[index].position === 4 ?
                              (
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
                              ) :
                              (<div className={cs('none-value-tag')}>-</div>)
                          }

                        </td>

                        <td>
                          <input
                            onChange={(e) =>
                              modifyUserItem(index, e.target.value, 'name')}
                            value={newUserArray[index].name}
                            type={'text'}
                            maxLength={5}
                            placeholder={'이름'}
                            required={true}
                          />
                        </td>

                        <td className="w-1/3">
                          <input
                            onChange={(e) => modifyUserItem(index, e.target.value, 'studentPhone')}
                            value={newUserArray[index].phoneNum}
                            type={'tel'}
                            placeholder={'사용자 전화번호'}
                            required={true}
                            maxLength={13}
                            className={cs('phone-number-input')}
                          />
                        </td>

                        <td>
                          {
                            newUserArray[index].position === 3 || newUserArray[index].position === 4 ?
                              (
                                <input
                                  onChange={(e) => modifyUserItem(index, e.target.value, 'parentsPhone1')}
                                  value={newUserArray[index].parentsPhoneNum1}
                                  type={'tel'}
                                  placeholder={'학부모1 전화번호'}
                                  maxLength={13}
                                  className={cs('phone-number-input')}
                                />
                              ) :
                              (<div className={cs('none-value-tag')}>-</div>)
                          }

                        </td>

                        <td>
                          {
                            newUserArray[index].position === 3 || newUserArray[index].position === 4 ?
                              (
                                <input
                                  onChange={(e) => modifyUserItem(index, e.target.value, 'parentsPhone2')}
                                  value={newUserArray[index].parentsPhoneNum2}
                                  type={'tel'}
                                  placeholder={'학부모2 전화번호'}
                                  maxLength={13}
                                  className={cs('phone-number-input')}
                                />
                              ) :
                              (<div className={cs('none-value-tag')}>-</div>)
                          }

                        </td>

                        <td>
                          <input
                            onChange={(e) => {
                              modifyUserItem(index, e.target.value, 'account')
                            }}
                            value={newUserArray[index].account}
                            type={'text'}
                            minLength={4}
                            maxLength={15}
                            required={true}
                            placeholder={'아이디 / 학번'}
                          />
                        </td>

                        <td>
                          <div>
                            <input
                              onChange={(e) => {
                                modifyUserItem(index, e.target.value, 'password')
                              }}
                              value={newUserArray[index].password}
                              type={showPassword ? "text" : "password"}
                              minLength={4}
                              maxLength={15}
                              placeholder={'4자리 이상 입력'}
                              required={true}
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
              <button onClick={addNewUser} className={cs('add-row-button')} type={'button'}>
                <CgPlayListAdd className={cs('list-icon')}/> <span>행 추가</span></button>
              <button onClick={removeUser} className={cs('remove-row-button')} type={'button'}>
                <CgPlayListRemove className={cs('list-icon')}/> <span>행 제거</span></button>
              {
                newUserArray.length > 0 &&
                (
                  <button onClick={handleShowPassword} className={cs('show-password-button')} type={'button'}>
                    {
                      showPassword ? (
                          <div><AiFillEyeInvisible className={cs('eye-icon')}/> <span>비밀번호 숨김</span></div>) :
                        (<div><AiFillEye className={cs('eye-icon')}/> <span>비밀번호 보기</span></div>)
                    }
                  </button>
                )}

              <button className={cs('add-user-button')} type={'submit'}>
                <FiUserPlus className={cs('add-user-icon2')}/> <span>사용자 추가</span></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddUserWithTyping

