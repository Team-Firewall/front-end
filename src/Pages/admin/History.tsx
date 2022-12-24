import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiFillEdit } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { ko } from 'date-fns/esm/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FiDelete } from 'react-icons/fi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { BsFillPrinterFill } from 'react-icons/bs'
import { ExcelDownloader } from '../../utils/ExcelDownloader'
import { MdSearch, MdSearchOff } from 'react-icons/md'
import axios, { AxiosResponse } from "axios"
import Modal from "@mui/material/Modal"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { animated, useSpring } from "react-spring"
import { FcInfo } from 'react-icons/fc'
import LinesEllipsis from 'react-lines-ellipsis'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import { Action } from "redux";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";

const cs = classNames.bind(styles)

interface dataValue {
  id: number,
  grade: number,
  class: number,
  name: string,
  userId: number,
  number: number,
  division: string,
  regulateId: number,
  reason: string,
  score: number,
  issuer: string,
  issuerId: string,
  regulate: string,
  createdDate: string,
  createdTime: string,
  updatedDate: string,
  updatedTime: string,
  checked: string,
  isChecked: boolean
}

interface optionDivision {
  id: number,
  regulate: string,
  score: number
}

interface FadeProps {
  children?: React.ReactElement;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
  const {in: open, children, onEnter, onExited, ...other} = props;
  const style = useSpring({
    from: {opacity: 0},
    to: {opacity: open ? 1 : 0},
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  )
})

const History = () => {
  const arrowUpButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, true)}>
        ▲
      </button>)
  }

  const arrowDownButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, false)}>
        ▼
      </button>
    )
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 540,
    bgcolor: 'background.paper',
    borderRadius: '6px',
    boxShadow: 5,
    p: 4,
  };

  const date = new Date()

  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const [permission, setPermission] = useState<number>(NaN)
  const [startDate, setStartDate] = useState<Date>(new Date(year, month, day - 7));
  const [endDate, setEndDate] = useState<Date>(date);

  const [headCheckbox, setHeadCheckbox] = useState<boolean>(false)

  const [bonusPointList, setBonusPointList] = useState<optionDivision[]>([])
  const [minusPointList, setMinusPointList] = useState<optionDivision[]>([])
  const [offsetPointList, setOffsetPointList] = useState<optionDivision[]>([])

  const [data, setData] = useState<dataValue[]>([])
  const [tableData, setTableData] = useState<dataValue[]>([])
  const [headContent, setHeadContent] = useState([
    {'title': 'grade', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'class', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'number', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'name', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'division', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'regulate', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'score', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'issuer', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'date', 'isHover': false, 'order': true, 'textValue': ''}
  ])

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalValue, setModalValue] = useState({
    id: 0,
    grade: 0,
    class: 0,
    number: 0,
    name: '',
    date: new Date(),
    checked: '',
    regulate: '',
    regulateId: 0,
    issuer: '',
    issuerId: '',
    reason: '',
    newReason: ''
  })

  const changeModalValue = (value: dataValue) => {
    console.log(value)
    const date = new Date(value.createdDate)

    setModalValue({
      id: value.id,
      grade: value.grade,
      class: value.class,
      number: value.number,
      name: value.name,
      date: date,
      checked: value.checked,
      regulate: value.regulate,
      regulateId: value.regulateId,
      issuer: value.issuer,
      issuerId: value.issuerId,
      reason: value.reason,
      newReason: ''
    })

    setModalOpen(true)
  }

  const handleClose = () => setModalOpen(false)

  useEffect(() => {
    let token = getItemWithExpireTime()
    if (token) {
      token = jwt_decode(token)
      setPermission(token.permission)

      fetch('http://localhost:3001/v1/point')
        .then((response) => response.json())
        .then((data) => {
          setData(data.map((v: any) => ({...v, isChecked: false})))
          setTableData(data)
        })
      setOptionValues()
    }
  }, [])

  const setOptionValues = () => {
    for (let i = 0; i < 3; i++) {
      fetch(`http://localhost:3001/v1/regulate/scoreDivision?checked=${i === 0 ? '상점' : i === 1 ? '벌점' : '상쇄점'}`)
        .then((response) => response.json())
        .then((data) => {
          if (i === 0) {
            setBonusPointList(data)
          } else if (i === 1) {
            setMinusPointList(data)
          } else if (i === 2) {
            setOffsetPointList(data)
          }
        })
    }
  }

  const searchHandler = () => {
    setHeadContent(headContent.map((it) =>
      it ? {...it, textValue: ''} : it
    ))
    setIsSearchOpen(!isSearchOpen)
  }

  const changeTextValue = (title: string, textValue: string) => {
    setTimeout(() => {
      setHeadContent(headContent.map((v: any) =>
        v.title === title ? {...v, textValue: textValue} : v
      ))
    }, 500)
  }

  useEffect(() => {
    setTableData(Object.values(data).filter((value) => (
      String(value.grade).includes(headContent[0].textValue) &&
      String(value.class).includes(headContent[1].textValue) &&
      String(value.number).includes(headContent[2].textValue) &&
      value.name.includes(headContent[3].textValue) &&
      value.checked.includes(headContent[4].textValue) &&
      value.regulate.includes(headContent[5].textValue) &&
      String(value.score).includes(headContent[6].textValue) &&
      value.issuer.includes(headContent[7].textValue) &&
      value.createdDate.includes(headContent[8].textValue)
    )))
  }, [headContent])

  const datePickerCustom = ({
                              value,
                              onClick
                            }: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="date-picker-custom" onClick={onClick}>
      <AiOutlineCalendar className={'calendar-icon'}/>
      {value}
    </button>
  )

  const modalDatePickerCustom = ({
                                   value,
                                   onClick
                                 }: { value: string; onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }) => (
    <button className="modal-date-picker-custom" onClick={onClick}>
      <span>
        <AiOutlineCalendar className={'calendar-icon'} style={{marginTop: '1px'}}/>
        {value}
      </span>
    </button>
  )


  const checkAllButton = (isClicked: boolean) => {
    setHeadCheckbox(!headCheckbox)
    setTableData(tableData.map((v: dataValue) =>
      v.id ? {...v, isChecked: isClicked ? true : false} : v
    ))
  }

  const handelCheckButton = (idx: number) => {
    setTableData(tableData.map((v: dataValue) =>
      v.id === idx ? {...v, isChecked: !v.isChecked} : v
    ))
  }

  useEffect(() => {
    let flag: boolean = true
    if (tableData.length === 0) flag = false

    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].isChecked) {
        flag = false
      }
    }

    if (flag) {
      setHeadCheckbox(true)
    } else {
      setHeadCheckbox(false)
    }
  }, [tableData])

  const handleMouseOver = (title: string, hover: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, isHover: hover ? true : false} : v
    ))
  }

  const handleValueSort = (title: string, asc: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, order: asc ? true : false} : v
    ))

    if (title === 'grade') {
      tableData.sort((a: dataValue, b: dataValue) => asc ? (a.grade > b.grade) ? 1 : -1 : (a.grade < b.grade) ? 1 : -1)
    } else if (title === 'class') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.class > b.class) ? 1 : -1 : (a.class < b.class) ? 1 : -1)
    } else if (title === 'number') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.number > b.number) ? 1 : -1 : (a.number < b.number) ? 1 : -1)
    } else if (title === 'name') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.name > b.name) ? 1 : -1 : (a.name < b.name) ? 1 : -1)
    } else if (title === 'division') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.division > b.division) ? 1 : -1 : (a.division < b.division) ? 1 : -1)
    } else if (title === 'regulate') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.regulate > b.regulate) ? 1 : -1 : (a.regulate < b.regulate) ? 1 : -1)
    } else if (title === 'score') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.score > b.score) ? 1 : -1 : (a.score < b.score) ? 1 : -1)
    } else if (title === 'issuer') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.issuer > b.issuer) ? 1 : -1 : (a.issuer < b.issuer) ? 1 : -1)
    } else if (title === 'date') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.createdDate > b.createdDate) ? 1 : -1 : (a.createdDate < b.createdDate) ? 1 : -1)
    }

    setData([...data])

    console.log(headContent)
  }

  const lookupDate = () => {
    const firstDate: string = startDate.getFullYear() + '-' + Number(startDate.getMonth() + 1) + '-' + startDate.getDate()
    const secondDate: string = endDate.getFullYear() + '-' + Number(endDate.getMonth() + 1) + '-' + endDate.getDate()

    let reqData = {
      'firstDate': firstDate,
      'secondDate': secondDate
    }

    console.log(reqData)

    axios.post('http://localhost:3001/v1/point/date', JSON.stringify(reqData), {
      headers: {'Content-Type': 'application/json'}
    }).then((res) => {
      setData(res.data.data.map((v: any) => ({...v, isChecked: false})))
      setTableData(res.data.data.map((v: any) => ({...v, isChecked: false})))
    }).catch(() => {
      alert('두 날짜 사이의 발급내역이 존재하지 않습니다.')
    })
  }

  const deleteHistory = () => {
    let data: { id: number }[] = []
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].isChecked)
        data.push({'id': tableData[i].id})
    }

    if (data.length === 0) {
      Swal.fire({
        html: '<div style="font-size: 25px">삭제 할 항목을 선택하지 않으셨습니다.</div>',
        icon: 'error',
        confirmButtonText: '확인'
      })
    } else {
      Swal.fire({
        text: `총 ${data.length}개의 발급내역을 삭제하시겠습니까?`,
        icon: 'question',
        iconColor: '#fc7f03',
        showCancelButton: true,
        cancelButtonColor: '#dc3545',
        confirmButtonColor: '#28a745',
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      }).then((res: SweetAlertResult<Action<any>>) => {
        if (res.isConfirmed) {
          axios.delete('http://localhost:3001/v1/point', {data: data})
            .then((res: AxiosResponse<any>) => {
              if (res.data.success) {
                Swal.fire({
                  title: '삭제 완료',
                  text: '발급항목 삭제가 완료되었습니다.',
                  icon: 'success',
                  confirmButtonText: '확인'
                }).then(() => {
                  window.location.reload()
                })
              }
            })
            .catch((error) => alert('error'))
        }
      })
    }
  }

  const modifyHistory = () => {
    const date: string = modalValue.date.getFullYear() + '-' + Number(modalValue.date.getMonth() + 1) + '-' + modalValue.date.getDate()

    console.log(date)

    let data = [
      {
        'id': modalValue.id,
        'regulateId': modalValue.regulateId,
        'reason': modalValue.newReason,
        'createAt': date
      }
    ]

    console.log(data)

    if (window.confirm(`${modalValue.name}학생의 발급내역을 수정하시겠습니까?`)) {
      axios.put('http://localhost:3001/v1/point', JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'}
      }).then((res: AxiosResponse<any>) => {
        console.log(res.data.success)
        if (res.data.success) {
          alert('발급내역이 수정되었습니다.')
          window.location.reload()
        }
      })
    }
  }


  if (![0, 1, 2].includes(permission)) {
    return (<div>notFound</div>)
  } else {
    if (!tableData) {
      return <Loading/>
    } else {
      return (
        <div>
          <div className={'top-tag'}>
            <AdminSideBar/>
            <div className={'page-name'}>
              <span><AiFillEdit className={'page-name-icon'} style={{fontSize: '21px'}}/> 발급내역 수정</span>
              <span><LogoutButton/></span>
            </div>
          </div>

          <div className={'date-picker-container'}>
            <DatePicker
              locale={ko}
              dateFormat={'yyyy-MM-dd'}
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              startDate={startDate}
              customInput={React.createElement(datePickerCustom)}
              endDate={endDate}
              maxDate={endDate}
            />
            <span className={'date-hyphen'}>-</span>
            <DatePicker
              locale={ko}
              dateFormat={'yyyy-MM-dd'}
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              startDate={startDate}
              endDate={endDate}
              customInput={React.createElement(datePickerCustom)}
              minDate={startDate}
              maxDate={date}
            />

            <div className={'lookup-btn'}>
              <button onClick={lookupDate}>조회</button>
            </div>

          </div>

          <div className={'container'} style={{marginTop: '1vh'}}>
            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              open={modalOpen}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={modalOpen}>
                <Box sx={style}>
                  <Typography id="spring-modal-title" variant="h6" component="h2">
                    발급내역 수정
                  </Typography>
                  <Typography id="spring-modal-description" sx={{mt: 2}}>
                    <table className={'modal-table'}>
                      <tr>
                        <td className={'modal-table-info'}
                            style={{borderTopLeftRadius: '7px'}}
                        >학생정보
                        </td>
                        <td>
                          <div className={'grey-input-tag'}>
                          <span>
                            {modalValue.grade}학년 {modalValue.class}반 {modalValue.number}번 {modalValue.name}
                          </span>
                          </div>
                          <div className={'info-tag'}><FcInfo style={{marginBottom: '-3px'}}/> 학생정보는 수정 하실 수 없습니다.</div>
                        </td>
                      </tr>

                      <tr>
                        <td className={'modal-table-info'}>발급일자</td>
                        <td>
                          <DatePicker
                            locale={ko}
                            dateFormat={'yyyy-MM-dd'}
                            selected={modalValue.date}
                            onChange={(changedDate: Date) => setModalValue((v) => ({...v, date: changedDate}))}
                            customInput={React.createElement(modalDatePickerCustom)}
                            maxDate={date}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td className={'modal-table-info'}>발급항목</td>
                        <td>
                          <div style={{marginTop: '10px', marginBottom: '10px'}}>
                            <select className={'check-division'}
                                    onChange={(e) => setModalValue((v) => ({...v, checked: e.target.value}))}
                                    style={{background: modalValue.checked === '상점' ? '#f2fff2' : modalValue.checked === '벌점' ? '#fff3f3' : '#f3f3ff'}}
                                    value={modalValue.checked}>
                              <option value={'상점'}>상점</option>
                              <option value={'벌점'}>벌점</option>
                              <option value={'상쇄점'}>상쇄점</option>
                            </select>

                            <select
                              className={'regulate-division'}
                              onChange={(e) => setModalValue((v) => ({...v, regulateId: Number(e.target.value)}))}
                              value={modalValue.regulateId}>

                              <option value={0}> ------ 항목을 선택 해 주세요 ------</option>
                              {Object.values(modalValue.checked === '상점' ? bonusPointList : modalValue.checked === '벌점' ? minusPointList : offsetPointList).map((value: any, index: number) => (
                                <option key={index} value={value.id}>{`[${value.score}점] ${value.regulate}`}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td className={'modal-table-info'}>발급자</td>
                        <td>
                          <div className={'grey-input-tag'}>
                          <span>
                            {modalValue.issuer}({modalValue.issuerId})
                          </span>
                          </div>
                          <div className={'info-tag'}><FcInfo style={{marginBottom: '-3px'}}/> 발급자는 수정 하실 수 없습니다.</div>
                        </td>
                      </tr>

                      <tr>
                        <td className={'modal-table-info'}>메모</td>
                        <td>
                          <input className={'reason-input'} placeholder={modalValue.reason}
                                 onChange={(e) => setModalValue((v) => ({...v, newReason: e.target.value}))}/>
                        </td>
                      </tr>
                    </table>

                    <div className={'modal-button-container'}>
                      <button className={'cancel-btn'} onClick={() => setModalOpen(false)}>취소</button>
                      <button className={'save-btn'} onClick={modifyHistory}>저장</button>
                    </div>
                  </Typography>
                </Box>
              </Fade>
            </Modal>

            <div className={'management-table-container'} style={{height: '90%'}}>
              <table>
                <thead>
                <th style={{width: '3%'}}>
                  <input type={"checkbox"} onClick={(e) => checkAllButton(e.currentTarget.checked)}
                         checked={headCheckbox}/>
                </th>

                <th
                  style={{minWidth: '46px'}}
                  className={'number-value'}
                >
                <span onMouseOver={() => handleMouseOver('grade', true)}
                      onMouseLeave={() => handleMouseOver('grade', false)}>
                  학년
                  {
                    headContent[0].isHover ? headContent[0].order ? arrowDownButton('grade') : arrowUpButton('grade') : ''
                  }
                  </span>
                </th>

                <th
                  style={{minWidth: '46px'}}
                  className={'number-value'}
                >
                <span
                  onMouseOver={() => handleMouseOver('class', true)}
                  onMouseLeave={() => handleMouseOver('class', false)}>
                  반
                  {
                    headContent[1].isHover ? headContent[1].order ? arrowDownButton('class') : arrowUpButton('class') : ''
                  }
                </span>
                </th>

                <th
                  style={{minWidth: '46px'}}
                  className={'number-value'}>
                <span
                  onMouseOver={() => handleMouseOver('number', true)}
                  onMouseLeave={() => handleMouseOver('number', false)}>
                  번호
                  {
                    headContent[2].isHover ? headContent[2].order ? arrowDownButton('number') : arrowUpButton('number') : ''
                  }
                </span>
                </th>

                <th
                  style={{width: '8%'}}>
                <span
                  onMouseOver={() => handleMouseOver('name', true)}
                  onMouseLeave={() => handleMouseOver('name', false)}>
                  이름
                  {
                    headContent[3].isHover ? headContent[3].order ? arrowDownButton('name') : arrowUpButton('name') : ''
                  }
                </span>
                </th>

                <th style={{width: '6%'}}>
                <span
                  onMouseOver={() => handleMouseOver('division', true)}
                  onMouseLeave={() => handleMouseOver('division', false)}>
                  구분
                  {
                    headContent[4].isHover ? headContent[4].order ? arrowDownButton('division') : arrowUpButton('division') : ''
                  }
                </span>
                </th>

                <th style={{width: '48%'}}>
                <span
                  onMouseOver={() => handleMouseOver('regulate', true)}
                  onMouseLeave={() => handleMouseOver('regulate', false)}>
                  발급항목
                  {
                    headContent[5].isHover ? headContent[5].order ? arrowDownButton('regulate') : arrowUpButton('regulate') : ''
                  }
                </span>
                </th>

                <th style={{minWidth: '48px'}}>
                <span onMouseOver={() => handleMouseOver('score', true)}
                      onMouseLeave={() => handleMouseOver('score', false)}>
                  점수
                  {
                    headContent[6].isHover ? headContent[6].order ? arrowDownButton('score') : arrowUpButton('score') : ''
                  }
                </span>
                </th>

                <th
                  style={{minWidth: '60px'}}>
                <span
                  onMouseOver={() => handleMouseOver('issuer', true)}
                  onMouseLeave={() => handleMouseOver('issuer', false)}>
                  발급자
                  {
                    headContent[7].isHover ? headContent[7].order ? arrowDownButton('issuer') : arrowUpButton('issuer') : ''
                  }
                </span>
                </th>

                <th>
                <span onMouseOver={() => handleMouseOver('date', true)}
                      onMouseLeave={() => handleMouseOver('date', false)}>
                  발급일
                  {
                    headContent[8].isHover ? headContent[8].order ? arrowDownButton('date') : arrowUpButton('date') : ''
                  }
                </span>
                </th>

                </thead>

                <tbody>
                {
                  isSearchOpen && (<tr className={cs('search-tr')}>
                    <td></td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('grade', e.target.value)}
                               maxLength={1}/></td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('class', e.target.value)}
                               maxLength={1}/></td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('number', e.target.value)}
                               maxLength={1}/></td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('name', e.target.value)}
                               maxLength={4}/></td>
                    <td><input className={cs('search-input')}
                               onChange={(e) => changeTextValue('division', e.target.value)}
                               maxLength={3}/></td>
                    <td><input className={cs('search-input')}
                               onChange={(e) => changeTextValue('regulate', e.target.value)}/></td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('score', e.target.value)}/>
                    </td>
                    <td><input className={cs('search-input')}
                               onChange={(e) => changeTextValue('issuer', e.target.value)}/>
                    </td>
                    <td><input className={cs('search-input')} onChange={(e) => changeTextValue('date', e.target.value)}/>
                    </td>
                  </tr>)
                }

                {
                  tableData.length === 0 && (
                    <tr className={'table-no-data'} style={{border: 'none'}}>
                      <br/>
                      <td colSpan={10}>검색하신 결과가 존재하지 않습니다.</td>
                    </tr>
                  )
                }

                {Object.values(tableData).map((value: any, index: number) => (
                  <tr key={index} className={cs('edit-tr')}
                      style={{backgroundColor: value.isChecked ? '#eff9ff' : ''}}
                      onDoubleClick={() => changeModalValue(value)}>
                    <td>
                      <input type={"checkbox"} checked={value.isChecked} onClick={() => handelCheckButton(value.id)}/>
                    </td>
                    <td>{value.grade}</td>
                    <td>{value.class}</td>
                    <td>{value.number}</td>
                    <td>{value.name}</td>
                    <td className={cs(value.checked === '상점' ? 'plus' : 'minus')}>{value.checked}</td>
                    <td>
                      <LinesEllipsis
                        text={value.regulate}
                        maxLine='1'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                      />

                    </td>
                    <td>{value.score}</td>
                    <td>{value.issuer}</td>
                    <td>{value.createdDate}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <div className={cs('button-container')}>
              <button style={{float: 'left', marginLeft: '0'}} className={cs('search-btn')}
                      onClick={searchHandler}>
                {
                  isSearchOpen ? (<><MdSearchOff className={cs('icon', 'search-icon')}/> 검색 닫기</>) :
                    (<><MdSearch className={cs('icon', 'search-icon')}/> 검색하기</>)
                }
              </button>
              <button className={cs('print-btn')}><BsFillPrinterFill className={cs('icon')}/> 인쇄하기</button>
              <button className={cs('excel-btn')}
                      onClick={() => ExcelDownloader(tableData, '발급내역', startDate, endDate)}>
                <RiFileExcel2Fill className={cs('icon')}/> 엑셀로 저장
              </button>
              <button className={cs('delete-btn')} onClick={deleteHistory}><FiDelete className={cs('icon')}/> 선택삭제
              </button>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default History