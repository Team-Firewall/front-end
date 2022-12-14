import React, { useState } from 'react';
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
import gbswLogo from '../images/gbsw-logo.png'
import LoginContainer from '../Components/LoginContainer'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getItemWithExpireTime } from "../utils/ControllToken";
import jwt_decode from "jwt-decode";
import { useMediaQuery } from 'react-responsive';
import MinimalizedPage from "./MinimalizedPage";
import { BrowserView, MobileView } from 'react-device-detect';
import { RiErrorWarningFill } from 'react-icons/ri'
import MobileNotSupportedView from "../Components/MobileNotSupportedView";

const cs = classNames.bind(styles)

type Anchor = 'left' | 'bottom' | 'right';

export default function SwipeableTemporaryDrawer() {
  const isPC = useMediaQuery({
    query: '(min-width: 1300px)'
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (getItemWithExpireTime()) {
      let token = getItemWithExpireTime()
      token = jwt_decode(token)

      if (token.iat && token.permission === 3 || token.permission === 4) {
        navigate('/points')
      } else if (token.iat && token.permission > 0 - 2) {
        navigate('/admin/issuance')
      }
    }
  }, [])

  const [state, setState] = useState({
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
                <img src={Logo} className={cs('logo-img')} alt={'school-logo'}/>
                <div className={cs('login')}>
                  <div className={cs('text')}>???????????? ???????????????. <FiLogIn className={cs('icons')}/></div>
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
          <ListItemButton onClick={() => navigate('/rule-table')}>
            <ListItemIcon>
              <ListAltIcon/>
            </ListItemIcon>
            <ListItemText primary={'???/?????? ??? ??????'}/>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <BrowserView>
        {
          isPC ?
            (<div className={cs('parent')}>
              {(['left'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                  <Button onClick={toggleDrawer(anchor, true)}
                          style={{marginLeft: '15px', marginTop: '15px'}}><GoThreeBars
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
                  <div className={cs('sub-container')}>
                    <div className={cs('title')}>
                      <img src={gbswLogo}
                           className={cs('gbsw-logo')} alt={'school-logo'}/>
                      <div className={cs('tag-top')}>?????????????????????????????????</div>
                      <div className={cs('tag-bottom')}>????????? ?????????</div>
                    </div>

                    <LoginContainer/>
                  </div>
                </div>

                <div className={cs('mileage-container')}>
                  <div className={cs('text-container')}>
                    <div>
                      ?????????????????????????????????<br/> ?????? ???????????? (??????????????) ?????? ??????
                    </div>

                    <button onClick={() => navigate('/rule-table')}>
                      <span className={cs("label")}>??????????? ??????</span>
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
            </div>) : <MinimalizedPage/>
        }
      </BrowserView>
      <MobileView>
        <MobileNotSupportedView/>
      </MobileView>
    </>
  );
}