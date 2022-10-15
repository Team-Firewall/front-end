import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../images/ScoolFullLogo.png";
import { TbUser } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from '@mui/icons-material/Logout';
import Button from "@mui/material/Button";
import { GoThreeBars } from "react-icons/go";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { getItemWithExpireTime, Logout } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import classNames from "classnames/bind";
import styles from '../Style/Points.module.css'
import PointTimeLine from "../Components/PointTimeLine";
import PointTable from "../Components/PointTable";
import { AiOutlineHome } from 'react-icons/ai'
import LogoutButton from "../Components/LogoutButton";

const cs = classNames.bind(styles)

type Anchor = 'left' | 'bottom' | 'right';

const Points = () => {
  const [username, setUserName] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
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
        <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'} /></span> {'>'} 상•벌점 조회</span>
        <span><LogoutButton/></span>
        <div className={'divider-line'}/>
      </div>

      <div className={cs('container')}>
        <div className={cs('username-tag')}>{username}님의 상벌점 이력</div>

        <PointTable/>
        <PointTimeLine/>
      </div>

    </div>
  )
}

export default Points