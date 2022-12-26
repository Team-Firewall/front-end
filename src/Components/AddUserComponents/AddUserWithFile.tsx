import React, { useState } from "react"
import axios, { AxiosResponse } from "axios";
import classNames from "classnames/bind";
import styles from '../../Style/FileInput.module.css'
import { RiFileExcel2Line } from "react-icons/ri";
import { AiOutlineCheck } from "react-icons/ai";
import Swal from "sweetalert2";
import { HiOutlineUserAdd } from 'react-icons/hi'
import { AiOutlineDelete } from 'react-icons/ai'

const cs = classNames.bind(styles)

const AddUserWithFile = () => {
  const [fileName, setFileName] = useState<string>('')
  const [responseObject, setResponseObject] = useState([])

  const fileHandler = (file: any) => {
    const formData = new FormData()
    formData.append("file_set", file)

    axios.post('http://localhost:8082/trance-student', formData, {
      headers: {'Content-Type' : 'multipart/form-data'}
    }).then((res: AxiosResponse<any>) => {
      console.log(res)
      if (res.status === 200) {
        setResponseObject(res.data)
        setFileName(file.name)
      }
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        html: '<div style="font-size: 20px; text-align: center">파일 형식이 일치하지 않습니다.<br>파일 형식 수정 후 다시 시도하여 주세요.</div>'
      })
    })
  }

  const handleFileSelect = (e: any) => {
    Swal.fire({
      html: `<div style="font-size: 17px">파일을 적용하시겠습니까?</div>`,
      icon: 'question',
      iconColor: '#3249de',
      showCancelButton: true,
      confirmButtonColor: '#1fb051',
      cancelButtonColor: '#d33',
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    })
      .then((res) => {
        if (res.isConfirmed) {
          fileHandler(e.target.files[0])
        }
      })
  }

  const handleSheetPage = () => {
    window.open('https://docs.google.com/spreadsheets/d/1wnBAxmb78hZ__yjJKR73DAKR5UUMH67ZiP3FrHwvMjg/edit#gid=0', '_blank')
  }

  const resetData = () => {
    setFileName('')
    setResponseObject([])
  }

  const handleUserAdd = () => {
    Swal.fire({
      text: `총 ${responseObject.length}명의 사용자를 추가하시겠습니까?`,
      icon: 'question',
      iconColor: '#2682ec',
      showCancelButton: true,
      cancelButtonColor: '#dc3545',
      confirmButtonColor: '#28a745',
      confirmButtonText: '확인',
      cancelButtonText: '취소'
    }).then((res) => {
      if (res.isConfirmed) {
        axios.post('http://localhost:3001/addUser', JSON.stringify(responseObject), {
          headers: {"Content-Type": "application/json"}
        }).then((res) => {
          console.log('this is response', res.data)
          if (res.data.success) {
            Swal.fire({
              title: '유저 추가 완료',
              text: '유저 추가가 완료되었습니다.',
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

  return (
    <div>
      <div className={cs('file-input-container')}>
        <span>{fileName ? fileName : '엑셀 파일을 선택해주세요.'}</span>
        <label htmlFor="file">파일찾기</label>
        <input type={'file'} name={'file'} id={'file'} required={true} onChange={handleFileSelect}/>
      </div>

      <div className={'add-user-container'} style={{marginTop: '1.5rem', height: '63vh', display: !fileName ? 'table' : ''}}>
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
        {
          fileName && (
            <div className={'button-container'}>
              <button className={'add-user-btn'} onClick={handleUserAdd}><HiOutlineUserAdd className={'icon'}/> 유저 추가</button>
              <button className={'reset-btn'} onClick={resetData}><AiOutlineDelete className={'icon'}/> 데이터 초기화</button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default AddUserWithFile
