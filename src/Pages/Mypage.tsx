import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getItemWithExpireTime, Logout } from "../utils/ControllToken";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../images/ScoolFullLogo.png";
import { TbUser } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { GoThreeBars } from "react-icons/go";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import jwt_decode from "jwt-decode";
import { AiOutlineHome } from "react-icons/ai";
import LogoutButton from "../Components/LogoutButton";
import styles from '../Style/Mypage.module.css'
import classNames from "classnames/bind";
import UserInformation from "../Components/MyPageComponents/UserInformation";
import ParentsInformation from "../Components/MyPageComponents/ParentsInformation";
import ChangePassword from "../Components/MyPageComponents/ChangePassword";

const cs = classNames.bind(styles)

type Anchor = 'left' | 'bottom' | 'right';

const MyPage = () => {

  const [username, setUserName] = useState<string>('')
  const [informationState, setInformationState] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    console.log(decodeToken)
    setUserName(decodeToken.name)
  }, [])

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
          <ListItemButton onClick={() => navigate('/points')}>
            <ListItemIcon>
              <WorkspacePremiumOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'상/벌점 조회'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/mypage')}>
            <ListItemIcon>
              <AccountCircleIcon/>
            </ListItemIcon>
            <ListItemText primary={'마이페이지'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/rule-table')}>
            <ListItemIcon>
              <ListAltIcon/>
            </ListItemIcon>
            <ListItemText primary={'상/벌점 표 확인'}/>
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
        <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 마이페이지</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <div className={cs('my-page-container')}>

        <div className={cs('username-tag')}>{username}님의 정보</div>

        <div className={cs('edit-box-container')}>
          <div className={cs('edit-box', 'first-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>기본정보</div>
              <div className={cs('div-tag-bottom')}>이름, 전화번호, 학번</div>
            </div>

            <button onClick={() => setInformationState(0)}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'second-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>학부모 정보</div>
              <div className={cs('div-tag-bottom')}>전화번호 정보</div>
            </div>

            <button onClick={() => setInformationState(1)}>보기</button>
          </div>

          <div className={cs('gap')}/>

          <div className={cs('edit-box', 'third-edit-box')}>
            <div className={cs('text-container')}>
              <div className={cs('div-tag-top')}>비밀번호 변경</div>
              <div className={cs('div-tag-bottom')}>비밀번호를 변경합니다.</div>
            </div>

            <button onClick={() => setInformationState(2)}>수정</button>
          </div>

        </div>

        <div className={cs('information-component-container')}>
          {
            informationState === 0 && (
              <UserInformation/>
            )
          }
          {
            informationState === 1 && (
              <ParentsInformation/>
            )
          }
          {
            informationState === 2 && (
              <ChangePassword/>
            )
          }
        </div>

      </div>

    </div>
  )
}

export default MyPage