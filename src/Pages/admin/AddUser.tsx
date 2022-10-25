import React, { useEffect, useState, useRef } from "react";
import { getItemWithExpireTime, Logout } from "../../utils/ControllToken";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../../images/ScoolFullLogo.png";
import { TbUser } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Button from "@mui/material/Button";
import { GoThreeBars } from "react-icons/go";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AiOutlineHome } from "react-icons/ai";
import LogoutButton from "../../Components/LogoutButton";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { phoneNumberAutoFormat } from '../../utils/PhoneNumberFormatter'
import axios from "axios"

type Anchor = 'left' | 'bottom' | 'right';

const AddUser = () => {
  const navigate = useNavigate()
  const phoneRef = useRef();

  const [userPosition, setUserPosition] = useState<number>()
  const [username, setUsername] = useState<string>('')

  const [newUserName, setNewUserName] = useState<string>()
  const [newPhoneNumber, setNewPhoneNumber]= useState<any>()
  const [newUserId, setNewUserId] = useState<string>()
  const [newUserPassword, setNewUserPassword] = useState<string>()
  const [newUserPosition, setNewUserPosition] = useState<number>()


  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserPosition(decodeToken.position)
    setUsername(decodeToken.name)
  }, [])

  const handlePhoneNumber = (e: any) => {
    const targetValue= phoneNumberAutoFormat(e.target.value)
    setNewPhoneNumber(targetValue)
    console.log(newPhoneNumber)
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

    console.log(data)

    axios.post('http://localhost:3001/addUser', JSON.stringify(data), {
      headers: {"Content-Type": "application/json"}
    }).then(() => alert('유저가 추가되었습니다.'))
      .catch(() => alert('ERROR'))
  }

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({...state, [anchor]: open});
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{width: 250}}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem>
          <ListItemButton style={{backgroundColor: '#fff'}}>

            <ListItemIcon>
              <div>
                <img src={Logo} className={'logo-img'} alt={'school logo'}/>
                <div className={'login'}>
                  <div className={'text'}><TbUser className={'user-icons'}/> {username}님, 환영합니다.</div>
                </div>
              </div>
            </ListItemIcon>

            <ListItemText/>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider/>
      <List>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/issuance')}>
            <ListItemIcon>
              <ControlPointDuplicateIcon/>
            </ListItemIcon>
            <ListItemText primary={'점수 발급'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('')}>
            <ListItemIcon>
              <BorderColorIcon/>
            </ListItemIcon>
            <ListItemText primary={'발급내역 수정'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/')}>
            <ListItemIcon>
              <QueryStatsIcon/>
            </ListItemIcon>
            <ListItemText primary={'자료조회 및 통계'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/add-user')}>
            <ListItemIcon>
              <PersonAddIcon/>
            </ListItemIcon>
            <ListItemText primary={'사용자 추가 및 관리'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={Logout}>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary={'로그아웃'}/>
          </ListItemButton>
        </ListItem>

      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor: "left") => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} style={{marginLeft: '15px', marginTop: '15px'}}><GoThreeBars
            className={'bar-icon'}/></Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}

      <div className={'top-tag'}>
        <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 사용자 추가 및 관리</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <span>이름</span> <input placeholder={'이름을 입력하세요.'} onChange={(e) => setNewUserName(e.target.value)}/>
      <span>전화번호</span> <input type="tel" value={newPhoneNumber} onChange={handlePhoneNumber} maxLength={13} placeholder={'전화번호를 입력하세요.'}/>
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

export default AddUser