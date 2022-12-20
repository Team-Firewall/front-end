import React, { useEffect, useState } from 'react'
import AdminSideBar from "../../Components/Sidebar/AdminSideBar"
import { AiOutlineHome } from "react-icons/ai"
import LogoutButton from "../../Components/LogoutButton"
import Loading from "../../Components/Loading"
import classNames from "classnames/bind"
import styles from '../../Style/History.module.css'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/esm/locale'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FiDelete } from 'react-icons/fi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { BsFillPrinterFill } from 'react-icons/bs'
import { ExcelDownloader } from '../../utils/ExcelDownloader'
import { MdSearch, MdSearchOff } from 'react-icons/md'
import axios from "axios";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { animated, useSpring } from "react-spring";

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
  regulate: string,
  createdDate: string,
  createdTime: string,
  updatedDate: string,
  updatedTime: string,
  checked: string,
  isChecked: boolean
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
      <button className={'arrowUpButton'} onClick={() => handleValueSort(title, true)}>
        <BsArrowUp className={'arrow-icon'}/>
      </button>)
  }

  const arrowDownButton = (title: string) => {
    return (
      <button className={'arrowUpButton'} onClick={() => handleValueSort(title, false)}>
        <BsArrowDown className={'arrow-icon'}/>
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

  const [startDate, setStartDate] = useState<Date>(new Date(year, month, day - 7));
  const [endDate, setEndDate] = useState<Date>(date);
  const [headCheckbox, setHeadCheckbox] = useState<boolean>(false)

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
    regulate: '',
    issuer: '',
    // issuerId: '',
    reason: ''
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
      regulate: value.regulate,
      issuer: value.issuer,
      // issuerId: value.issuerId,
      reason: value.reason
    })

    setModalOpen(true)
  }

  const handleClose = () => setModalOpen(false)

  useEffect(() => {
    fetch('http://localhost:3001/v1/point')
      .then((response) => response.json())
      .then((data) => {
        setData(data.map((v: any) => ({...v, isChecked: false})))
        setTableData(data)
        console.log(data)
      })
  }, [])

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
      data.sort((a: dataValue, b: dataValue) => asc ? (a.grade < b.grade) ? 1 : -1 : (a.grade > b.grade) ? 1 : -1)
    } else if (title === 'class') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.class < b.class) ? 1 : -1 : (a.class > b.class) ? 1 : -1)
    } else if (title === 'number') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.number < b.number) ? 1 : -1 : (a.number > b.number) ? 1 : -1)
    } else if (title === 'name') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.name > b.name) ? 1 : -1 : (a.name < b.name) ? 1 : -1)
    } else if (title === 'division') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.division > b.division) ? 1 : -1 : (a.division < b.division) ? 1 : -1)
    } else if (title === 'regulate') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.regulate > b.regulate) ? 1 : -1 : (a.regulate < b.regulate) ? 1 : -1)
    } else if (title === 'score') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.score < b.score) ? 1 : -1 : (a.score > b.score) ? 1 : -1)
    } else if (title === 'issuer') {
      data.sort((a: dataValue, b: dataValue) => asc ? (a.issuer < b.issuer) ? 1 : -1 : (a.issuer > b.issuer) ? 1 : -1)
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

  if (!tableData) {
    return <Loading/>
  } else {
    return (
      <div>
        <div className={'top-tag'}>
          <AdminSideBar/>
          <div className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 발급 내역
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
            maxDate={date}
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
                  <table>
                    <tr>
                      <td>학생정보</td>
                      <td>{modalValue.grade}학년 {modalValue.class}학년 {modalValue.number}번 {modalValue.name}</td>
                    </tr>

                    <tr>
                      <td>발급일자</td>
                      <td>{String(modalValue.date)}</td>
                    </tr>

                    <tr>
                      <td>발급항목</td>
                      <td>{modalValue.regulate}</td>
                    </tr>

                    <tr>
                      <td>발급자</td>
                      <td>{modalValue.issuer}</td>
                    </tr>

                    <tr>
                      <td>메모</td>
                      <td>{modalValue.reason}</td>
                    </tr>
                  </table>
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
                style={{width: '5%'}}
                className={'number-value'}>
                <span>학년</span>
              </th>

              <th
                style={{width: '5%'}}
                className={'number-value'}>
                <span>반</span>
              </th>

              <th
                style={{width: '5%'}}
                className={'number-value'}>
                <span>번호</span>
              </th>

              <th
                style={{width: '8%'}}>
                <span>이름</span>
              </th>

              <th style={{width: '6%'}}>
                <span>구분</span>
              </th>

              <th style={{width: '48%'}}>
                <span>발급항목</span>
              </th>

              <th>
                <span>점수</span>
              </th>

              <th
                style={{minWidth: '45px'}}>
                <span>발급자</span>
              </th>

              <th>
                <span>발급일</span>
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
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('division', e.target.value)}
                             maxLength={3}/></td>
                  <td><input className={cs('search-input')}
                             onChange={(e) => changeTextValue('regulate', e.target.value)}/></td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('score', e.target.value)}/>
                  </td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('issuer', e.target.value)}/>
                  </td>
                  <td><input className={cs('search-input')} onChange={(e) => changeTextValue('date', e.target.value)}/>
                  </td>
                </tr>)
              }

              {Object.values(tableData).map((value: any, index: number) => (
                <tr key={index} className={cs('edit-tr')}
                    style={{backgroundColor: value.isChecked ? '#eff9ff' : ''}}
                    onDoubleClick={() => changeModalValue(value)}>
                  <td><input type={"checkbox"} checked={value.isChecked} onClick={() => handelCheckButton(value.id)}/>
                  </td>
                  <td>{value.grade}</td>
                  <td>{value.class}</td>
                  <td>{value.number}</td>
                  <td>{value.name}</td>
                  <td className={cs(value.checked === '상점' ? 'plus' : 'minus')}>{value.checked}</td>
                  <td>{value.regulate}</td>
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
            <button className={cs('excel-btn')} onClick={() => ExcelDownloader(tableData, '발급내역', startDate, endDate)}>
              <RiFileExcel2Fill className={cs('icon')}/> 엑셀로 저장
            </button>
            <button className={cs('delete-btn')}><FiDelete className={cs('icon')}/> 선택삭제</button>
          </div>
        </div>
      </div>
    )
  }
}

export default History;