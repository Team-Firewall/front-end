import React, { FormEvent, useEffect, useState } from "react";
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
import { MdPlaylistAddCheck, MdControlPointDuplicate } from 'react-icons/md'
import { BsCheckAll } from 'react-icons/bs'
import Swal from "sweetalert2";
import axios from "axios";
import LogoutButton from "../../Components/LogoutButton";

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

interface apiSenderOption {
  userId: string,
  regulateId: string,
  reason: string,
  token: string
}

const Issuance = () => {
  const [permission, setPermission] = useState<number>(NaN)
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
  const [bonusPointList, setBonusPointList] = useState<optionDivision[]>([])
  const [minusPointList, setMinusPointList] = useState<optionDivision[]>([])
  const [offsetPointList, setOffsetPointList] = useState<optionDivision[]>([])
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    let token = getItemWithExpireTime()
    if (token) {
      setToken(token)
      token = jwt_decode(token)
      setPermission(token.permission)
      setIssuanceName(token.name)
      setOptionValues()
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHover(true);
  }
  const handleMouseLeave = () => {
    setIsHover(false);
  }

  const setOptionValues = () => {
    for (let i = 0; i < 3; i++) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/regulate/scoreDivision?checked=${i === 0 ? '??????' : i === 1 ? '??????' : '?????????'}`)
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
      toast.success(`${tempArray[4]} ????????? ?????????????????????.`)
    } else {
      toast.error(`${tempArray[4]} ????????? ?????? ?????????????????????.`)
    }
  }

  const removeUser = (value: number, name: string) => {
    setUserArray(current => (
      current.filter((user) => user.studentNumber !== value)
    ))

    toast(`${name} ????????? ?????? ???????????????.`,
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
      alert('?????? ??? ???????????? ????????????.')
    } else if (window.confirm('?????? ???????????? ?????? ?????????????????????????')) {
      setUserArray([])
    }
  }

  const getUserObject = (e: FormEvent) => {
    e.preventDefault()

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'permission': studentDivision,
        'grade': grade,
        'classNum': classNumber,
        'number': number,
        'name': name
      })
    }

    fetch(`${process.env.REACT_APP_API_URL}/v1/user/student`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setUserTmpArray(data)
        setIsSearched(true)
      })
  }

  const applySameValues = () => {
    if (userArray.length < 2) {
      alert('?????? ????????? ?????? ??? ???????????? 2??? ??????????????? ?????????.')
    } else if (userArray[0].regulateId === 0) {
      alert('?????? ????????? ????????? ?????????.')
    } else {
      let lastPhrase = userArray[0].memo.length === 0 ? '?????? ????????? ?????????????????????????' : `?????? ????????? <strong style="color: #6f7bd9">'${userArray[0].memo}' </strong>????????? ?????????????????????????`
      Swal.fire({
        html: '<div style="font-size: 17px">?????? ????????? ?????? ?????? ????????? ????????? ????????? ???????????? ???????????????.</div> <br/>' +
          `?????? ??????????????? <strong style="color: #38a0e5">'${userArray[0].selectOption} </strong>` +
          lastPhrase,
        icon: 'warning',
        iconColor: '#e56565',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '??????',
        cancelButtonText: '??????'
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
            console.log(`index: ${userArray[i].index}  ?????? ????????? : ${userArray[i].studentId}, ?????? ????????? : ${userArray[i].regulateId}, ??????: ${userArray[i].grade}, ???: ${userArray[i].classNumber}, ??????: ${userArray[i].studentNumber}, ??????: ${userArray[i].name}, ????????????: ${userArray[i].pointDivision}, ?????? ?????? : ${userArray[i].selectOption}, ??????: ${userArray[i].memo}, ?????????: ${userArray[i].issuer}`)
          }
        })
    }
  }

  const addAllUser = () => {
    let repeatedValue: number = 0, appliedValue: number = 0

    if (window.confirm(`${userTmpArray[0].name} ?????? ??? ${userTmpArray.length - 1}??? ????????? ?????? ???????????? ?????????????????????????`)) {
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
              'studentDivision': userTmpArray[j].position === 3 ? '????????????' : '?????????',
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

    alert(`${repeatedValue > 0 && appliedValue === 0 ? '?????? ????????? ?????? ?????????????????????.' : repeatedValue > 0 ? `????????? ?????? ${repeatedValue}??? ??? ${appliedValue}?????? ????????? ?????????????????????.` : `${appliedValue}?????? ????????? ?????????????????????.`}`)
  }

  const issuance = () => {
    let data: apiSenderOption[] = []
    for (let i = 0; i < userArray.length; i++) {
      data.push({
        'userId': String(userArray[i].studentId),
        'regulateId': String(userArray[i].regulateId),
        'reason': userArray[i].memo,
        'token': token
      })
    }

    let string: string = ''
    let flag: boolean = true

    if (userArray.length === 0) {
      alert('?????? ???????????? ????????????.')
    } else {
      for (let i = 0; i < userArray.length; i++) {
        if (userArray[i].regulateId === 0) {
          flag = false
          break
        }
      }

      if (flag) {
        if (userArray.length === 1) {
          string = `${userArray[0].name} ???????????? ????????? ?????? ???????????????????`
        } else if (userArray.length > 1) {
          string = `${userArray[0].name} ?????? ??? ${userArray.length - 1}????????? ????????? ?????? ???????????????????`
        }
      } else {
        alert('?????? ????????? ?????? ????????? ????????? ?????????.')
      }
    }

    if (userArray.length > 0 && flag) {
      Swal.fire({
        text: string,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#dc3545',
        confirmButtonColor: '#28a745',
        confirmButtonText: '??????',
        cancelButtonText: '??????'
      }).then((res) => {
        if (res.isConfirmed) {
          axios.post(`${process.env.REACT_APP_API_URL}/v1/point`, JSON.stringify(data), {
            headers: {"Content-Type": "application/json"}
          }).then((res) => {
            if (res.data.success) {
              console.log(res.data)
              Swal.fire({
                title: '?????? ?????? ??????',
                text: '?????? ????????? ?????????????????????.',
                icon: 'success',
                confirmButtonText: '??????'
              }).then(() => {
                window.location.reload()
              })
            }
          })
        }
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

  if (![0, 1, 2].includes(permission)) {
    return (<div>notFound</div>)
  } else {
    return (
      <div>
        <div className={'top-tag'}>
          <AdminSideBar/>
          <div className={'page-name'}>
            <span><MdControlPointDuplicate className={'page-name-icon'}/> ?????? ??????</span>
            <span><LogoutButton/></span>
          </div>
        </div>

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
                  ?????? ????????? ??????
                </Typography>
                <Typography id="spring-modal-description" sx={{mt: 2}}>
                  <div className={'search-input-container'}>
                    <form onSubmit={getUserObject}>
                      <select onChange={(e) => setStudentDivision(Number(e.target.value))}>
                        <option value={3}>????????????</option>
                        <option value={4}>?????????</option>
                      </select>
                      <input placeholder={'??????'} className={'number-input'} type={'number'} min={1} max={3}
                             onChange={(e) => setGrade(Number(e.target.value))}/>
                      <input placeholder={'???'} className={'number-input'} type={'number'} min={1} max={4}
                             onChange={(e) => setClassNumber(Number(e.target.value))}/>
                      <input placeholder={'??????'} className={'number-input'} type={'number'} min={1} max={20}
                             onChange={(e) => setNumber(Number(e.target.value))}/>
                      <input placeholder={'??????'} className={'name-search-input'}
                             onChange={(e) => setName(e.target.value)}/>
                      <button type={'submit'}>??????</button>
                    </form>
                  </div>

                  {
                    isSearched && (
                      <>
                        <div className={cs('add-user-info')}>
                          <div><FiUserPlus className={cs('user-add-icon')}/><span> ??? ???????????? ????????? ?????? ??? ????????? ???????????????.</span>
                          </div>
                        </div>

                        <div className={'searched-component'}>
                          {
                            userTmpArray.length > 0 && (
                              <div className={'searched-table-container'}>
                                <table className={'searched-table'}>
                                  <thead>
                                  <tr>
                                    <th style={{borderTopLeftRadius: '4px'}}>?????? ??????</th>
                                    <th>??????</th>
                                    <th>???</th>
                                    <th>??????</th>
                                    <th>??????</th>
                                    <th style={{borderTopRightRadius: '4px', borderRight: 'none'}}></th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {Object.values(userTmpArray).map((log: any, i: number) => (
                                    <tr key={i} style={{color: '#000'}}>
                                      <td>{log.position % 2 === 0 ? '?????????' : '????????????'}</td>
                                      <td>{log.grade}</td>
                                      <td>{log.classNum}</td>
                                      <td>{log.number}</td>
                                      <td>{log.name}</td>
                                      <td className={cs('user-add-td')}>
                                        <button className={cs('add-user-btn')}
                                                value={[`${log.position % 2 === 0 ? '?????????' : '????????????'}`, `${log.grade}`, `${log.classNum}`, `${log.number}`, `${log.name}`, `${log.id}`]}
                                                onClick={pushUser}>
                                          <FiUserPlus style={{marginBottom: '-3px'}}/>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          }
                          {
                            userTmpArray.length === 0 && (
                              <div className={'searched-table-container'} style={{display: "table"}}>
                                <div className={cs('not-found-value')}><AiFillInfoCircle className={cs('info-icon2')}/>
                                  <span>?????? ????????? ???????????? ????????????.</span></div>
                              </div>
                            )
                          }

                          <div className={'button-container'}>
                            <button className={'exit-btn'} onClick={() => setOpen(false)}>
                              <AiFillCloseCircle className={'exit-btn-icon'}/>
                              <span style={{marginLeft: '3px'}}>??? ??????</span>
                            </button>

                            <button className={'add-all-user-btn'} onClick={addAllUser}>
                              <BsCheckAll className={'double-check-icon'}/> ?????? ?????? ??????
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
          <div className={'management-table-container'} style={{display: userArray.length < 1 ? 'table' : ''}}>

            {
              userArray.length === 0 && (
                <div className={cs('not-add-user-tag')}>
                  <AiFillInfoCircle className={cs('info-icon')}/>
                  <span> ?????? ???????????? ????????? ?????????.</span>
                  <div style={{fontSize: '13px', marginTop: '1.5vh'}}>?????? ????????? ?????? ???, ?????? ??????????????? ????????? ????????? ???????????????.</div>
                </div>
              )
            }

            {
              userArray.length > 0 && (
                <table>
                  <thead>
                  <tr>
                    <th style={{borderTopLeftRadius: '5px'}}>????????????</th>
                    <th>??????</th>
                    <th>???</th>
                    <th>??????</th>
                    <th>??????</th>
                    <th>??????</th>
                    <th>????????????</th>
                    <th>??????</th>
                    <th>????????????</th>
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
                                }}
                                style={{background: userArray[i].pointDivision === 0 ? '#f2fff2' : userArray[i].pointDivision === 1 ? '#fff3f3' : '#f3f3ff'}}
                                value={userArray[i].pointDivision}>
                          <option value={0}>??????</option>
                          <option value={1}>??????</option>
                          <option value={2}>?????????</option>
                        </select>
                      </td>
                      <td style={{width: '30vw'}}>
                        <select className={cs('select-point')}
                                onChange={(e) => editIssuanceList(log.studentId, 'selectOption', e.target.value)}
                                value={userArray[i].selectOption}
                        >
                          <option value={0}> ------ ????????? ?????? ??? ????????? ------</option>
                          {Object.values(userArray[i].pointDivision === 0 ? bonusPointList : userArray[i].pointDivision === 1 ? minusPointList : offsetPointList).map((value: any, index: number) => (
                            <option key={index}
                                    onClick={() => editIssuanceList(log.studentId, 'regulateId', value.id)}>{`[${value.score}???] ${value.regulate}`}</option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <input onChange={(e) => editIssuanceList(log.studentId, 'memo', e.target.value)}
                                 className={cs('input-memo')} placeholder={'????????? ???????????????.'}
                                 value={userArray[i].memo}/>
                      </td>

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
              <span> ?????? ????????? ??????</span>
            </Button>

            <button onClick={deleteAllUser} className={cs('delete-all-btn')}><FaTrashAlt
              style={{marginBottom: '-2px'}}/> <span>?????? ??????</span>
            </button>

            <button className={cs('same-item-apply-btn')} onClick={applySameValues}>
              <MdPlaylistAddCheck style={{marginBottom: '-4.5px', fontSize: '20px'}}/> <span>?????? ?????? ??????</span>
            </button>

            <button className={cs('issue-btn')} onClick={issuance}>
              <AiFillCheckCircle style={{marginBottom: '-2px'}}/><span> ?????? ????????????</span>
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