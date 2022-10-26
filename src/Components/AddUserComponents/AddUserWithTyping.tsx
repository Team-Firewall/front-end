import React, { useState } from "react";
import { phoneNumberAutoFormat } from "../../utils/PhoneNumberFormatter";
import axios from "axios";

const AddUserWithTyping = () => {

  const [newUserName, setNewUserName] = useState<string>()
  const [newPhoneNumber, setNewPhoneNumber] = useState<any>()
  const [newUserId, setNewUserId] = useState<string>()
  const [newUserPassword, setNewUserPassword] = useState<string>()
  const [newUserPosition, setNewUserPosition] = useState<number>()

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
    }).then(() => alert('유저가 추가되었습니다.'))
      .catch(() => alert('ERROR'))
  }

  return (
    <div>
      <span>이름</span> <input placeholder={'이름을 입력하세요.'} onChange={(e) => setNewUserName(e.target.value)}/>
      <span>전화번호</span> <input type="tel" value={newPhoneNumber} onChange={handlePhoneNumber} maxLength={13}
                               placeholder={'전화번호를 입력하세요.'}/>
      <span>아이디</span> <input placeholder={'아이디를 입력하세요'} onChange={(e) => setNewUserId(e.target.value)}/>
      <span>비밀번호</span> <input placeholder={'비밀번호를 입력하세요'} onChange={(e) => setNewUserPassword(e.target.value)}/>
      <span>권한</span> <br/>
      <span>고등학생</span> <input type={'radio'} name={'userPosition'} onClick={() => setNewUserPosition(0)}/>
      <span>중학생</span> <input type={'radio'} name={'userPosition'} onClick={() => setNewUserPosition(2)}/>
      <span>고등학교 교사</span> <input type={'radio'} name={'userPosition'} onClick={() => setNewUserPosition(1)}/>
      <span>중학교 교사</span> <input type={'radio'} name={'userPosition'} onClick={() => setNewUserPosition(3)}/>
      <span>관리자</span> <input type={'radio'} name={'userPosition'} onClick={() => setNewUserPosition(4)}/>
      <button onClick={AddUserHandler}>추가</button>
    </div>
  )
}

export default AddUserWithTyping