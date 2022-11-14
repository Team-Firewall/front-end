import React, { useState } from "react";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import axios from "axios";
import Swal from 'sweetalert2'
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

let x = 3;

const AddUserWithTyping = () => {

  interface NewUser {
    index: number,
    position: number,
    grade: any,
    number: undefined,
    classNum: undefined,
    name: undefined,
    phoneNum: undefined,
    parentsPhoneNum1: undefined,
    parentsPhoneNum2: undefined,
    id: undefined,
    password: undefined
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
        grade: undefined,
        number: undefined,
        classNum: undefined,
        name: undefined,
        phoneNum: undefined,
        parentsPhoneNum1: undefined,
        parentsPhoneNum2: undefined,
        id: undefined,
        password: undefined
      }]))
  }

  const modifyUserItem = (index: number, value: string, classification: string) => {
    console.log(index, value, classification)
    if (classification === 'grade') {
      setNewUserArray(newUserArray.map((it) =>
        it.index === index ? {
          ...it,
          grade: value,
        } : it
      ))
    }
    console.log(newUserArray)
  }

  function removeItem(item: any) {
    setItems((items) => items.filter((i) => i !== item));
  }

  const handlePhoneNumber = (e: any) => {
    const targetValue= phoneNumberAutoFormat(e.target.value)
    setNewPhoneNumber(targetValue)
  }

  const AddUserHandler = () => {
    let phoneNumber = newPhoneNumber.replace(/-/g, "")

    let data = {
      "name": newUserName,
      "phone": phoneNumber,
      "account": newUserId,
      "password": newUserPassword,
      "role": newUserPosition
    }

    axios.post('http://localhost:3001/addUser', JSON.stringify(data), {
      headers: {"Content-Type": "application/json"}
    }).then(() => Swal.fire({
      title: '유저 추가 완료',
      text: '유저 추가가 완료되었습니다.',
      icon: 'success',
      confirmButtonText: '확인'
    }).then(() => {
      window.location.replace('/')
    }))
      .catch(() => alert('ERROR'))
  }

  return (
    <div>
      <div className={'add-user-container'}>
        <div>사용자 추가</div>

        <div className="p-20">

          <table cellPadding={0} className="mt-8 w-full">
            <thead>
            <tr>
              <th>권한</th>
              <th>학년</th>
              <th>반</th>
              <th>번호</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>학부모1 전화번호</th>
              <th>학부모2 전화번호</th>
              <th>아이디</th>
              <th>비밀번호</th>
              <th><button onClick={addNewUser}>추가</button></th>
            </tr>
            </thead>
            <tbody className="relative">
            <AnimatePresence>
              {Object.values(newUserArray).map((value: any, index: number) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{ opacity: { duration: 0.2 } }}
                  style={{
                    position: isPresent ? "relative" : "absolute",
                    display: isPresent ? "table-row" : "flex",
                    alignItems: isPresent ? "" : "center",
                  }}
                  className="w-full"
                  key={index}
                >
                  <td className="w-1/3">
                    <select>
                      <option>고등학생</option>
                      <option>중학생</option>
                      <option>담임선생님(고)</option>
                      <option>담임선생님(중)</option>
                      <option>선생님(고)</option>
                      <option>선생님(중)</option>
                      <option>관리자</option>
                    </select>
                  </td>

                  <td className="w-1/3">
                    <input value={newUserArray[index].grade} onChange={(e) => modifyUserItem(index, e.target.value, 'grade')}/>
                  </td>
                  <td className="w-1/3">2</td>
                  <td className="w-1/3">6</td>
                  <td className="w-1/3">김진효</td>
                  <td className="w-1/3">010-9285-9593</td>
                  <td className="w-1/3">010-9285-9593</td>
                  <td className="w-1/3">010-9285-9593</td>
                  <td className="w-1/3">아이디</td>
                  <td className="w-1/3">비번</td>

                  <td className="w-1/3 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 border rounded"
                    >
                      -
                    </button>
                  </td>
                </motion.tr>
              ))}
              {/*{items.map((item) => (*/}
              {/*  */}
              {/*))}*/}
            </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AddUserWithTyping

