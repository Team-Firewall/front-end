import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListAltIcon from '@mui/icons-material/ListAlt';
import classNames from "classnames/bind"
import styles from '../Style/Login.module.css'
import { FiLogIn } from 'react-icons/fi'
import { GoThreeBars } from 'react-icons/go'
import Logo from '../images/ScoolFullLogo.png'
import LoginContainer from '../Components/LoginContainer'
import { useNavigate } from "react-router-dom";

const cs = classNames.bind(styles)

type Anchor = 'left' | 'bottom' | 'right';

export default function SwipeableTemporaryDrawer() {
  const navigate = useNavigate()

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
                <img src={Logo} className={cs('logo-img')}/>
                <div className={cs('login')}>
                  <div className={cs('text')}>로그인이 필요합니다. <FiLogIn className={cs('icons')}/></div>
                </div>
              </div>
            </ListItemIcon>
            <ListItemText/>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider/>
      <List>
        {/*<div className={cs('not-login-menu')}>접근 가능한 메뉴가 없습니다.</div>*/}
        <ListItem>
          <ListItemButton onClick={() => navigate('/rule-table')}>
            <ListItemIcon>
              <ListAltIcon/>
            </ListItemIcon>
            <ListItemText primary={'상/벌점 표 확인'}/>
          </ListItemButton>
        </ListItem>
        {/*{['상벌점 조회', 'Trash', 'Spam'].map((text, index) => (*/}
        {/*  <ListItem key={text} disablePadding>*/}
        {/*    <ListItemButton>*/}
        {/*      <ListItemIcon>*/}
        {/*        {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}*/}
        {/*      </ListItemIcon>*/}
        {/*      <ListItemText primary={text}/>*/}
        {/*    </ListItemButton>*/}
        {/*  </ListItem>*/}
        {/*))}*/}
      </List>
    </Box>
  );

  return (
    <div className={cs('parent')}>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} style={{marginLeft: '15px', marginTop: '15px'}}><GoThreeBars
            className={cs('bar-icon')}/></Button>
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

      <div className={cs('container')}>

        <div className={cs('login-container')}>
          <br/>
          <div className={cs('title')}>
            <img src={'https://raw.github.com/GBSWHS/CI-Signature/main/symbol/symbol-only.png'}
                 className={cs('gbsw-logo')}/>
            <div className={cs('tag-top')}>경북소프트웨어고등학교</div>
            <div className={cs('tag-bottom')}>상벌점 시스템</div>
          </div>

          <LoginContainer/>

        </div>

        <div className={cs('mileage-container')}>
          <div className={cs('text-container')}>
            <div>
              경북소프트웨어고등학교<br/> 그린 마일리지 (상·벌점제) 운영 기준
            </div>

            <button onClick={() => navigate('/rule-table')}>
              <span className={cs("label")}>상·벌점 규정</span>
              <span className={cs("icon")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path fill="currentColor"
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
              </svg>
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}