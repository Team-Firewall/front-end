import React, { useEffect, useState } from "react";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { AiOutlineHome, AiFillCloseCircle, AiOutlineDelete, AiFillInfoCircle, AiFillCheckCircle } from "react-icons/ai";
import LogoutButton from "../../Components/LogoutButton";
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
import { BiListPlus } from 'react-icons/bi'
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
  studentDivision: string,
  grade: number,
  classNumber: number,
  studentNumber: number,
  name: string
}

const Issuance = () => {
  const [userPosition, setUserPosition] = useState<number>()
  const [open, setOpen] = useState(false);
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [studentDivision, setStudentDivision] = useState<number>(3)
  const [grade, setGrade] = useState<number>(0)
  const [classNumber, setClassNumber] = useState<number>(0)
  const [number, setNumber] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [userArray, setUserArray] = useState<User[]>([])
  const [userTmpArray, setUserTmpArray] = useState<User[]>([])
  const [isHover, setIsHover] = useState(false);
  const [pointDivision, setPointDivision] = useState<number>(0)

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
    setUserPosition(decodeToken.position)
  }, [])


  const pushUser = (e: any) => {
    e.preventDefault()
    let tempArray = (e.currentTarget.value).split(',')
    let flag: boolean = true

    for (let i = 0; i < userArray.length; i++) {
      console.log(userArray[i].studentNumber)
      if (userArray[i].studentNumber === tempArray[3]) {
        flag = false
      }
    }

    if (flag) {
      setUserArray(oldValue => ([
        ...oldValue,
        {
          'studentDivision': tempArray[0],
          'grade': tempArray[1],
          'classNumber': tempArray[2],
          'studentNumber': tempArray[3],
          'name': tempArray[4]
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
        // icon: '',
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
    // .then(() => console.log(res))
    //   console.log(res)
    //   // console.log(res.data)
    //   // setUserTmpArray(res.data)
    // })
  }


  const issuance = () => {
    let string: string = ''
    if (userArray.length === 0) {
      alert('발급 대상자가 없습니다.')
    } else if (userArray.length === 1) {
      string = `${userArray[0].name} 학생에게 점수를 발급 하시겠습니까?`
    } else if (userArray.length > 1) {
      string = `${userArray[0].name} 학생 외 ${userArray.length - 1}명에게 점수를 발급 하시겠습니까?`
    }

    if (userArray.length > 0) {
      if (window.confirm(string)) {
        Swal.fire({
          title: '점수 발급 완료',
          text: '점수 발급이 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        }).then(() => {
          window.location.reload()
        })
      }
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

  const loopTable = () => {
    const result = [];
    for (let i = 0; i < 40; i++) {
      result.push(<tr>
        <td className={cs('border-td')}>kim</td>
        <td className={cs('border-td')}>kim</td>
        <td className={cs('border-td')}>kim</td>
        <td className={cs('border-td')}>kim</td>
        <td className={cs('border-td')}>kim</td>
        <td className={cs('user-add-td')}>
          <button className={cs('add-user-btn')}
                  value={[`${i % 2 === 0 ? '중학생' : '고등학생'}`, `${i}`, `${i}`, `${i}`, `kim${i}`]} onClick={pushUser}>
            <FiUserPlus style={{marginBottom: '-3px'}}/>
            {/*<AiOutlineUserAdd style={{marginBottom: '-2px'}}/>*/}
          </button>
        </td>
      </tr>)
    }
    return result;
  }

  if (userPosition === 3 || userPosition === 4) {
    return (
      <div>notFound</div>
    )
  } else {
    return (
      <div>
        <AdminSideBar/>

        <div className={'top-tag'}>
          <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 점수 발급</span>
          <span><LogoutButton/></span>
          <div className={'divider-line'}/>
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
                                            value={[`${log.position % 2 === 0 ? '중학생' : '고등학생'}`, `${log.grade}`, `${log.classNum}`, `${log.number}`, `${log.name}`]}
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

                            <button className={'add-all-user-btn'}>
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
                <div className={cs('not-add-user-tag')}><AiFillInfoCircle className={cs('info-icon')}/>
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
                                onChange={(e) => setPointDivision(Number(e.target.value))}
                                style={{
                                  background: pointDivision === 0 ? '#f2fff2' : pointDivision === 1 ? '#fff3f3' : '#f3f3ff'
                                }}
                        >
                          <option value={0}>상점</option>
                          <option value={1}>벌점</option>
                          <option value={2}>상쇄점</option>
                        </select>
                      </td>
                      <td style={{width: '30vw'}}>
                        <select className={cs('select-point')}>
                          <option>[2점]학습활동에 도움을 줌</option>
                          <option>[2점]휴지를 자발적으로 줍는 학생</option>
                          <option>[5점]학교 홍보에 열심히 참여한 학생</option>
                        </select>
                      </td>
                      <td><input className={cs('input-memo')} placeholder={'  메모를 입력하세요.'}/></td>
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

            <button className={cs('same-item-apply-btn')}>
              <BiListPlus style={{marginBottom: '-4px', fontSize: '20px'}}/> <span>같은 항목 적용</span>
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