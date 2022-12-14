import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../../images/ScoolFullLogo.png";
import { TbUser } from "react-icons/tb";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RuleIcon from "@mui/icons-material/Rule";
import { getItemWithExpireTime, Logout } from "../../utils/ControllToken";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { GoThreeBars } from "react-icons/go";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import jwt_decode from "jwt-decode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

type Anchor = 'left' | 'bottom' | 'right';

export default function AdminSideBar() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUsername(decodeToken.name)
  }, [])

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const navigate = useNavigate()

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
                  <div className={'text'}><TbUser className={'user-icons'}/> {username}???, ???????????????.</div>
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
            <ListItemText primary={'?????? ??????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/history')}>
            <ListItemIcon>
              <BorderColorIcon/>
            </ListItemIcon>
            <ListItemText primary={'???????????? ??????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/statistics')}>
            <ListItemIcon>
              <QueryStatsIcon/>
            </ListItemIcon>
            <ListItemText primary={'???????????? ??? ??????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/management')}>
            <ListItemIcon>
              <PersonAddIcon/>
            </ListItemIcon>
            <ListItemText primary={'????????? ??????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/admin/regulation')}>
            <ListItemIcon>
              <RuleIcon/>
            </ListItemIcon>
            <ListItemText primary={'????????? ?????? ??????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={() => navigate('/mypage')}>
            <ListItemIcon>
              <AccountCircleIcon/>
            </ListItemIcon>
            <ListItemText primary={'???????????????'}/>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton onClick={Logout}>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary={'????????????'}/>
          </ListItemButton>
        </ListItem>

      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor: "left") => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)} style={{marginLeft: '15px', marginTop: '15px'}}>
            <GoThreeBars className={'bar-icon'}/></Button>
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
    </div>
  )
}
