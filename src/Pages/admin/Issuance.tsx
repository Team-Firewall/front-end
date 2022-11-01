import React, { useEffect, useState } from "react";
import { getItemWithExpireTime } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { AiOutlineHome, AiOutlineUserAdd, AiOutlineClose } from "react-icons/ai";
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
import { IoMdExit } from 'react-icons/io'

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

const Issuance = () => {
  const [userPosition, setUserPosition] = useState<number>()
  const [open, setOpen] = useState(false);
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [studentDivision, setStudentDivision] = useState<number>(0)
  const [grade, setGrade] = useState<number>()
  const [classNumber, setClassNumber] = useState<number>()
  const [number, setNumber] = useState<number>()
  const [name, setName] = useState<string>()
  const [userArray, setUserArray] = useState([
    {
      'studentDivision': '',
      'grade': '',
      'classNumber': '',
      'studentNumber': undefined,
      'name': ''
    }
  ])

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

    if (userArray.length === 1 && userArray[0].studentNumber === undefined ) {
      setUserArray([])
    }

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

  const removeUser = (e: any) => {
    console.log(e.target.value)
    setUserArray(current => (
      current.filter((user) => user.studentNumber !== e.target.value)
    ))

    console.log(userArray)
  }

  const handleOpen = () => {
    setStudentDivision(0)
    setGrade(undefined)
    setClassNumber(undefined)
    setNumber(undefined)
    setName(undefined)
    setOpen(true)
    setIsSearched(false)
  };
  const handleClose = () => setOpen(false);
  const handleClick = () => {
    setIsSearched(true)
    console.log(userArray)
  }

  const loopTable = () => {
    const result = [];
    for (let i = 0; i < 40; i++) {
      result.push(<tr>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
        <td>
          <button className={'add-user-btn'} value={[`${i}`, `${i}학년`, `${i}반`, `${i}번`, `kim${i}`]} onClick={pushUser}>
            <AiOutlineUserAdd/>
          </button>
        </td>
      </tr>);
    }
    return result;
  }

  if (userPosition === 0 || userPosition === 2) {
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

        <div className={'container'}>
          <Button onClick={handleOpen} style={{color: '#f00'}}>유저 추가</Button>
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
                        <option value={0}>고등학생</option>
                        <option value={2}>중학생</option>
                      </select>
                      <input placeholder={'학년'} className={'number-input'} type={'number'} min={1} max={3}
                             onChange={(e) => setGrade(Number(e.target.value))}/>
                      <input placeholder={'반'} className={'number-input'} type={'number'} min={1} max={4}
                             onChange={(e) => setClassNumber(Number(e.target.value))}/>
                      <input placeholder={'번호'} className={'number-input'} type={'number'} min={1} max={20}
                             onChange={(e) => setNumber(Number(e.target.value))}/>
                      <input placeholder={'이름'} className={'name-search-input'}
                             onChange={(e) => setName(e.target.value)}/>
                      <button onClick={handleClick} type={'submit'}>검색</button>
                    </form>
                  </div>

                  {
                    isSearched && (
                      <div className={'searched-component'}>
                        <div className={'searched-table-container'}>
                          <table className={'searched-table'}>
                            <thead>
                            <tr>
                              <th>학생 구분</th>
                              <th>학년</th>
                              <th>반</th>
                              <th>번호</th>
                              <th>이름</th>
                              <th>추가</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loopTable()}
                            </tbody>
                          </table>
                        </div>
                        <div className={'button-container'}>
                          <button className={'exit-btn'} onClick={() => setOpen(false)}><IoMdExit
                            className={'exit-btn-icon'}/>
                            <span style={{marginLeft: '3px'}}>창 닫기</span></button>
                        </div>
                      </div>
                    )
                  }

                </Typography>
              </Box>
            </Fade>
          </Modal>

          <div className={cs('recipient-table')}>
            <table>
              <thead>
              <tr>
                <th>학생구분</th>
                <th>학년</th>
                <th>반</th>
                <th>번호</th>
                <th>이름</th>
                <th>구분</th>
                <th>점수항목</th>
                <th>메모</th>
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
                  <td><input style={{width: '50px'}}/></td>
                  <td><input/></td>
                  <td><button onClick={removeUser} value={log.studentNumber}>제거</button></td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </div>
    )
  }
}

export default Issuance