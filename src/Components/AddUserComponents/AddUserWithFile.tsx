import React, { useState } from "react"
import axios from "axios";
import classNames from "classnames/bind";
import styles from '../../Style/FileInput.module.css'
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineCheck } from "react-icons/ai";

const cs = classNames.bind(styles)

const AddUserWithFile = () => {
  const [fileName, setFileName] = useState<string>('')
  const [responseObject, setResponseObject] = useState([])

  const fileHandler = (file: any) => {
    const formData = new FormData()
    formData.append("file_set", file)

    // fetch('http://localhost:8083/trance', {
    //   method: "POST",
    //   headers: {'Content-Type': 'multipart/form-data'},
    //   body: formData
    // })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err))

    axios.post('http://localhost:8082/trance', formData, {
      headers: {'Content-Type' : 'multipart/form-data'}
    }).then((res) => {
      console.log(res)
      if (res.status === 200) {
        console.log(res.data)
        setResponseObject(res.data)
        setFileName(file.name)
      }
    }).catch((err) => console.log(err))
  }

  const handleFileSelect = (e: any) => {
    if (window.confirm('적용하겠노 ?')) {
      fileHandler(e.target.files[0])
    }
  }

  const handleSheetPage = () => {
    window.open('https://docs.google.com/spreadsheets/d/1wnBAxmb78hZ__yjJKR73DAKR5UUMH67ZiP3FrHwvMjg/edit#gid=0', '_blank')
  }

  return (
    <div>
      <div className={cs('file-input-container')}>
        <span>{fileName ? fileName : '엑셀 파일을 선택해주세요.'}</span>
        <label htmlFor="file">파일찾기</label>
        <input type={'file'} name={'file'} id={'file'} required={true} onChange={handleFileSelect}/>
      </div>

      <div className={'add-user-container'} style={{marginTop: '1.5rem', height: '64vh', display: !fileName ? 'table' : ''}}>
        {
          !fileName ?
            (
              <div className={'no-user-tag'}>
                <div className={'tag1'}>
                  <RiFileExcel2Line className={'add-user-icon'} style={{ color: '#1ba466' }}/> <span>엑셀 파일을 선택해 주세요.</span>
                </div>

                <div className={'tag2'}>
                  <div className={'tag3'}>
                    <AiOutlineCheck className={'check-icon'}/> <span>확장자가 .xlsx인 파일을 선택하고 유저를 추가할 수 있습니다.</span>
                  </div>
                  <div className={'check-excel-btn'} onClick={handleSheetPage}>
                    <button>엑셀 형식 확인하기</button>
                  </div>
                </div>
              </div>
            ) :
            (
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
                  <th>아이디</th>
                  <th>비밀번호</th>
                  </thead>

                  <tbody>
                  {Object.values(responseObject).map((v: any, i: number) => (
                    <tr key={i}>
                      <td>{v.role}</td>
                      <td>{v.grade}</td>
                      <td>{v.class}</td>
                      <td>{v.number}</td>
                      <td>{v.name}</td>
                      <td>{v.phone}</td>
                      <td>{v.parentsPhoneNum1}</td>
                      <td>{v.parentsPhoneNum1}</td>
                      <td>{v.account}</td>
                      <td>{v.password}</td>
                    </tr>
                  ))}

                  </tbody>
                </table>
              </div>)
        }
      </div>
    </div>
  )
}

export default AddUserWithFile
