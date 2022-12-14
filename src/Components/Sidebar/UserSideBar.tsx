import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItemWithExpireTime, Logout } from "../../utils/ControllToken";
import jwt_decode from "jwt-decode";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logo from "../../images/ScoolFullLogo.png";
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

type Anchor = 'left' | 'bottom' | 'right';

export default function UserSideBar() {
  const navigate = useNavigate()
  const [username, setUserName] = useState<string>('')

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
          <ListItemButton onClick={() => navigate('/points')}>
            <ListItemIcon>
              <WorkspacePremiumOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={'???/?????? ??????'}/>
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
          <ListItemButton onClick={() => navigate('/rule-table')}>
            <ListItemIcon>
              <ListAltIcon/>
            </ListItemIcon>
            <ListItemText primary={'???/?????? ??? ??????'}/>
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
  )

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
    </div>
  )
}
