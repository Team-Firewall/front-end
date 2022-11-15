import React, { useEffect, useState } from "react";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { AiFillCloseCircle, AiOutlineDelete, AiFillInfoCircle, AiFillCheckCircle } from "react-icons/ai";
import AdminSideBar from "../../Components/Sidebar/AdminSideBar";
import { animated, useSpring } from "react-spring";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toast, Toaster } from "react-hot-toast";
import classNames from "classnames/bind";
import styles from '../../Style/IssuanceTable.module.css'
import { getTodayDate } from "../../utils/getTodayDate";
import { FiUserPlus } from 'react-icons/fi'
import { FaTrashAlt } from 'react-icons/fa'
import { MdPlaylistAddCheck } from 'react-icons/md'
import { BsCheckAll } from 'react-icons/bs'
import Swal from "sweetalert2";

const cs = classNames.bind(styles)

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
  );
});

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

interface User {
  index: number,
  studentId: number,
  regulateId: number,
  studentDivision: string,
  grade: number,
  classNumber: number,
  studentNumber: number,
  name: string,
  pointDivision: number,
  selectOption: string,
  memo: string,
  issuer: string
}

interface UserTempArray {
  classNum: number,
  grade: number,
  id: number,
  name: string,
  number: number,
  position: number
}

interface optionDivision {
  id: number,
  regulate: string,
  score: number
}

const Issuance = () => {
  const [userPosition, setUserPosition] = useState<number>()
  const [issuanceName, setIssuanceName] = useState<string>('')
  const [open, setOpen] = useState(false);
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [studentDivision, setStudentDivision] = useState<number>(3)
  const [grade, setGrade] = useState<number>(0)
  const [classNumber, setClassNumber] = useState<number>(0)
  const [number, setNumber] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [userArray, setUserArray] = useState<User[]>([])
  const [userTmpArray, setUserTmpArray] = useState<UserTempArray[]>([])
  const [isHover, setIsHover] = useState(false);
  const [pointDivision, setPointDivision] = useState<number>(0)
  // const [issuanceList, setIssuanceList] = useState<issuanceForm[]>([])
  const [pointOptionArray, setPointOptionArray] = useState<optionDivision[]>([])
  const [bonusPointList, setBonusPointList] = useState<optionDivision[]>([])
  const [minusPointList, setMinusPointList] = useState<optionDivision[]>([])
  const [offsetPointList, setOffsetPointList] = useState<optionDivision[]>([])

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    console.log(decodeToken)
    setUserPosition(decodeToken.position)
    setIssuanceName(decodeToken.name)

    setOptionValues()
  }, [])

  const setOptionValues = () => {
    for (let i = 0; i < 3; i++) {
      fetch(`http://localhost:3001/v1/regulate/scoreDivision?checked=${i}`)
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

  const editIssuanceList = (index: number, classification: string, value: any) => {
    if (classification === 'pointDivision') {
      setUserArray(userArray.map((it) =>
        it.studentId === index ? {...it, pointDivision: Number(value)} : it
      ))
    } else if (classification === 'selectOption') {
      setUserArray(userArray.map((it) =>
        it.studentId === index ? {...it, selectOption: String(value)} : it
      ))
    } else if (classification === 'memo') {
      setUserArray(userArray.map((it) =>
        it.studentId === index ? {...it, memo: String(value)} : it
      ))
    } else if (classification === 'regulateId') {
      setUserArray(userArray.map((it) =>
        it.studentId === index ? {...it, regulateId: Number(value)} : it
      ))
    }

    console.log(userArray)
  }

  const pushUser = (e: any) => {
    e.preventDefault()
    console.log((e.currentTarget.value).split(','))
    let tempArray = (e.currentTarget.value).split(',')
    let flag: boolean = true

    for (let i = 0; i < userArray.length; i++) {
      if (userArray[i].studentId === Number(tempArray[5])) {
        flag = false
      }
    }

    if (flag) {
      setUserArray(oldValue => ([
        ...oldValue,
        {
          'index': userArray.length + 1,
          'studentId': Number(tempArray[5]),
          'regulateId': 0,
          'studentDivision': tempArray[0],
          'grade': tempArray[1],
          'classNumber': tempArray[2],
          'studentNumber': tempArray[3],
          'pointDivision': 0,
          'selectOption': '',
          'memo': '',
          'name': tempArray[4],
          'issuer': issuanceName
        }]))
      toast.success(`${tempArray[4]} 학생을 추가하였습니다.`)
    } else {
      toast.error(`${tempArray[4]} 학생이 이미 추가되었습니다.`)
    }

    console.log(userArray)
  }

  const removeUser = (value: number, name: string) => {
    setUserArray(current => (
      current.filter((user) => user.studentNumber !== value)
    ))

    toast(`${name} 학생이 삭제 되었습니다.`,
      {
        style: {
          borderRadius: '10px',
          background: '#f14242',
          color: '#fff',
        },
      }
    );
  }

  const deleteAllUser = () => {
    if (userArray.length === 0) {
      alert('삭제 할 대상자가 없습니다.')
    } else if (window.confirm('발급 대상자를 모두 삭제하시겠습니까?')) {
      setUserArray([])
    }
  }

  const getUserObject = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'position': studentDivision,
        'grade': grade,
        'classNum': classNumber,
        'number': number,
        'name': name
      })
    };

    fetch('http://localhost:3001/v1/user/student', requestOptions)
      .then(res => res.json())
      .then(data => {
        setUserTmpArray(data)
        setIsSearched(true)
      })
  }

  const applySameValues = () => {
    if (userArray.length < 2) {
      alert('같은 항목을 적용 할 대상자는 2명 이상이여야 합니다.')
    } else if (userArray[0].regulateId === 0) {
      alert('점수 항목을 선택해 주세요.')
    } else {
      let lastPhrase = userArray[0].memo.length === 0 ? '점수 항목을 적용하시겠습니까?' : `점수 항목과 <strong style="color: #6f7bd9">'${userArray[0].memo}' </strong>메모를 적용하시겠습니까?`
      Swal.fire({
        html: '<div style="font-size: 17px">전체 대상자 같은 항목 적용은 첫번째 학생의 항목으로 적용됩니다.</div> <br/>' +
          `전체 대상자에게 <strong style="color: #38a0e5">'${userArray[0].selectOption} </strong>` +
          lastPhrase,
        icon: 'warning',
        iconColor: '#e56565',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '확인',
        cancelButtonText: '취소'
      })
        .then((res) => {
          if (res.isConfirmed) {
            console.log('true')
            setUserArray(userArray.map((it) =>
              it.index >= 0 ? {
                ...it,
                regulateId: userArray[0].regulateId,
                pointDivision: userArray[0].pointDivision,
                selectOption: userArray[0].selectOption,
                memo: userArray[0].memo,
              } : it
            ))
          }
          console.log('new', userArray)

          for (let i = 0; i < userArray.length; i++) {
            console.log(`index: ${userArray[i].index}  학생 아이디 : ${userArray[i].studentId}, 규정 아이디 : ${userArray[i].regulateId}, 학년: ${userArray[i].grade}, 반: ${userArray[i].classNumber}, 번호: ${userArray[i].studentNumber}, 이름: ${userArray[i].name}, 점수구분: ${userArray[i].pointDivision}, 점수 옵션 : ${userArray[i].selectOption}, 메모: ${userArray[i].memo}, 발급자: ${userArray[i].issuer}`)
          }
        })
    }
  }

  const addAllUser = () => {
    let repeatedValue: number = 0, appliedValue: number = 0

    if (window.confirm(`${userTmpArray[0].name} 학생 외 ${userTmpArray.length - 1}명 학생을 발급 대상자에 추가하시겠습니까?`)) {
      let studentIdArray = []
      for (let i = 0; i < userArray.length; i++) {
        studentIdArray.push(userArray[i].studentId)
      }

      for (let j = 0; j < userTmpArray.length; j++) {
        if (studentIdArray.includes(userTmpArray[j].id)) {
          repeatedValue += 1
        } else {
          appliedValue += 1
          setUserArray(oldValue => ([
            ...oldValue,
            {
              'index': userArray.length,
              'studentId': userTmpArray[j].id,
              'regulateId': 0,
              'studentDivision': userTmpArray[j].position === 3 ? '고등학생' : '중학생',
              'grade': userTmpArray[j].grade,
              'classNumber': userTmpArray[j].classNum,
              'studentNumber': userTmpArray[j].number,
              'pointDivision': 0,
              'selectOption': '',
              'memo': '',
              'name': userTmpArray[j].name,
              'issuer': issuanceName
            }]))
        }
      }
    }

    // console.log('tmp', userTmpArray)
    // console.log('userarr', userArray)
    // console.log('중복값: ', repeatedValue, '적용값', appliedValue)
    alert(`${repeatedValue > 0 && appliedValue === 0 ? '해당 학생이 이미 추가되었습니다.' : repeatedValue > 0 ? `중복된 학생 ${repeatedValue}명 외 ${appliedValue}명의 학생이 추가되었습니다.` : `${appliedValue}명의 학생이 추가되었습니다.`}`)
  }


  const issuance = () => {
    let string: string = ''
    let flag: boolean = true

    if (userArray.length === 0) {
      alert('발급 대상자가 없습니다.')
    } else {
      for (let i = 0; i < userArray.length; i++) {
        if (userArray[i].regulateId === 0) {
          flag = false
          break
        }
      }

      if (flag) {
        if (userArray.length === 1) {
          string = `${userArray[0].name} 학생에게 점수를 발급 하시겠습니까?`
        } else if (userArray.length > 1) {
          string = `${userArray[0].name} 학생 외 ${userArray.length - 1}명에게 점수를 발급 하시겠습니까?`
        }
      } else {
        alert('모든 학생의 점수 항목을 선택해 주세요.')
      }
    }

    if (userArray.length > 0 && flag) {
      Swal.fire({
        text: string,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#dc3545',
        confirmButtonColor: '#28a745',
        confirmButtonText: '발급',
        cancelButtonText: '취소'
      }).then((res) => {
        if (res.isConfirmed)
          Swal.fire({
            title: '점수 발급 완료',
            text: '점수 발급이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }).then(() => {
            window.location.reload()
          })
      })
    }
  }

  const handleOpen = () => {
    setStudentDivision(3)
    setGrade(0)
    setClassNumber(0)
    setNumber(0)
    setName('')
    setOpen(true)
    setIsSearched(false)
  };
  const handleClose = () => setOpen(false);

  if (userPosition === 3 || userPosition === 4) {
    return (
      <div>notFound</div>
    )
  } else {
    return (
      <div>
        <AdminSideBar/>

        {/*<div className={'top-tag'}>*/}
        {/*  <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 점수 발급</span>*/}
        {/*  <span><LogoutButton/></span>*/}
        {/*  <div className={'divider-line'}/>*/}
        {/*</div>*/}

        <div className={'container'} style={{width: userArray.length < 1 ? '60%' : '80%', transition: '0.5s'}}>
          <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography id="spring-modal-title" variant="h6" component="h2">
                  발급 대상자 추가
                </Typography>
                <Typography id="spring-modal-description" sx={{mt: 2}}>
                  <div className={'search-input-container'}>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                    }}>
                      <select onChange={(e) => setStudentDivision(Number(e.target.value))}>
                        <option value={3}>고등학생</option>
                        <option value={4}>중학생</option>
                      </select>
                      <input placeholder={'학년'} className={'number-input'} type={'number'} min={1} max={3}
                             onChange={(e) => setGrade(Number(e.target.value))}/>
                      <input placeholder={'반'} className={'number-input'} type={'number'} min={1} max={4}
                             onChange={(e) => setClassNumber(Number(e.target.value))}/>
                      <input placeholder={'번호'} className={'number-input'} type={'number'} min={1} max={20}
                             onChange={(e) => setNumber(Number(e.target.value))}/>
                      <input placeholder={'이름'} className={'name-search-input'}
                             onChange={(e) => setName(e.target.value)}/>
                      <button onClick={getUserObject} type={'submit'}>검색</button>
                    </form>
                  </div>

                  {
                    isSearched && (
                      <>
                        <div className={cs('add-user-info')}>
                          <div><FiUserPlus className={cs('user-add-icon')}/><span> 을 클릭하여 점수를 발급 할 학생을 추가하세요.</span>
                          </div>
                        </div>
                        <div className={'searched-component'}>
                          <div className={'searched-table-container'}>
                            <table className={'searched-table'}>
                              <thead>
                              <tr>
                                <th style={{borderTopLeftRadius: '4px'}}>학생 구분</th>
                                <th>학년</th>
                                <th>반</th>
                                <th>번호</th>
                                <th>이름</th>
                                <th style={{borderTopRightRadius: '4px', borderRight: 'none'}}></th>
                              </tr>
                              </thead>
                              <tbody>
                              {Object.values(userTmpArray).map((log: any, i: number) => (
                                <tr key={i} style={{color: '#000'}}>
                                  <td>{log.position % 2 === 0 ? '중학생' : '고등학생'}</td>
                                  <td>{log.grade}</td>
                                  <td>{log.classNum}</td>
                                  <td>{log.number}</td>
                                  <td>{log.name}</td>
                                  <td className={cs('user-add-td')}>
                                    <button className={cs('add-user-btn')}
                                            value={[`${log.position % 2 === 0 ? '중학생' : '고등학생'}`, `${log.grade}`, `${log.classNum}`, `${log.number}`, `${log.name}`, `${log.id}`]}
                                            onClick={pushUser}>
                                      <FiUserPlus style={{marginBottom: '-3px'}}/>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                          <div className={'button-container'}>
                            <button className={'exit-btn'} onClick={() => setOpen(false)}>
                              <AiFillCloseCircle className={'exit-btn-icon'}/>
                              <span style={{marginLeft: '3px'}}>창 닫기</span>
                            </button>

                            <button className={'add-all-user-btn'} onClick={addAllUser}>
                              <BsCheckAll className={'double-check-icon'}/> 모든 학생 추가
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  }

                </Typography>
              </Box>
            </Fade>
          </Modal>
          <div className={'recipient-table-container'} style={{display: userArray.length < 1 ? 'table' : ''}}>

            {
              userArray.length === 0 && (
                <div className={cs('not-add-user-tag')}>
                  <AiFillInfoCircle className={cs('info-icon')}/>
                  <span> 발급 대상자를 추가해 주세요.</span>
                  <div style={{fontSize: '13px', marginTop: '1.5vh'}}>발급 대상자 추가 후, 점수 발급하기를 누르면 점수가 발급됩니다.</div>
                </div>
              )
            }

            {
              userArray.length > 0 && (
                <table>
                  <thead>
                  <tr>
                    <th style={{borderTopLeftRadius: '5px'}}>학생구분</th>
                    <th>학년</th>
                    <th>반</th>
                    <th>번호</th>
                    <th>이름</th>
                    <th>구분</th>
                    <th>점수항목</th>
                    <th>메모</th>
                    <th>발급일자</th>
                    <th style={{borderTopRightRadius: '5px', borderRight: 'none'}}></th>
                  </tr>
                  </thead>
                  <tbody>


                  {Object.values(userArray).map((log: any, i: number) => (
                    <tr key={i} style={{color: '#000'}}>
                      <td>{log.studentDivision}</td>
                      <td>{log.grade}</td>
                      <td>{log.classNumber}</td>
                      <td>{log.studentNumber}</td>
                      <td>{log.name}</td>
                      <td style={{width: '6vw'}}>
                        <select className={cs('select-division')}
                                onChange={(e) => {
                                  editIssuanceList(log.studentId, 'pointDivision', e.target.value)
                                  console.log('hi', userArray[i].pointDivision, i)
                                }}
                                style={{
                                  background: userArray[i].pointDivision === 0 ? '#f2fff2' : userArray[i].pointDivision === 1 ? '#fff3f3' : '#f3f3ff'
                                }}
                                value={userArray[i].pointDivision}
                        >
                          <option value={0}>상점</option>
                          <option value={1}>벌점</option>
                          <option value={2}>상쇄점</option>
                        </select>
                      </td>
                      <td style={{width: '30vw'}}>
                        <select className={cs(userArray[i].regulateId === 0 ? 'select-point' : 'select-point')}
                                onChange={(e) => editIssuanceList(log.studentId, 'selectOption', e.target.value)}
                                value={userArray[i].selectOption}
                        >
                          <option value={0}> ------ 항목을 선택 해 주세요 ------</option>
                          {Object.values(userArray[i].pointDivision === 0 ? bonusPointList : userArray[i].pointDivision === 1 ? minusPointList : offsetPointList).map((value: any, index: number) => (
                            <option key={index}
                                    onClick={() => editIssuanceList(log.studentId, 'regulateId', value.id)}>{`[${value.score}점] ${value.regulate}`}</option>
                          ))}
                        </select>
                      </td>
                      <td><input onChange={(e) => editIssuanceList(log.studentId, 'memo', e.target.value)}
                                 className={cs('input-memo')} placeholder={'메모를 입력하세요.'}
                                 value={userArray[i].memo}
                      /></td>
                      <td>{getTodayDate()}</td>
                      <td style={{width: '40px', backgroundColor: '#fff'}}>
                        <button onClick={() => removeUser(log.studentNumber, log.name)} value={log.studentNumber}
                                className={cs('user-delete-btn')}>
                          <AiOutlineDelete style={{marginBottom: '-2px', fontSize: '18px'}}/></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )
            }

          </div>

          <div className={cs('bottom-button-container')}>
            <Button onClick={handleOpen} className={cs('modal-btn')}
                    style={{backgroundColor: isHover ? '#d5f0fc' : '#edfbff'}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
              <FiUserPlus style={{marginTop: '-2px', fontSize: '15px'}}/>
              <span> 발급 대상자 추가</span>
            </Button>

            <button onClick={deleteAllUser} className={cs('delete-all-btn')}><FaTrashAlt
              style={{marginBottom: '-2px'}}/> <span>전체 삭제</span>
            </button>

            <button className={cs('same-item-apply-btn')} onClick={applySameValues}>
              <MdPlaylistAddCheck style={{marginBottom: '-4.5px', fontSize: '20px'}}/> <span>같은 항목 적용</span>
            </button>

            <button className={cs('issue-btn')} onClick={issuance}>
              <AiFillCheckCircle style={{marginBottom: '-2px'}}/><span> 점수 발급하기</span>
            </button>
          </div>
        </div>
        <Toaster
          position="top-left"
          reverseOrder={false}
        />
      </div>
    )
  }
}

export default Issuance