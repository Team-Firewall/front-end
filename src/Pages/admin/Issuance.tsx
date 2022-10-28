import React, { useEffect, useState } from "react";
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
import RuleIcon from "@mui/icons-material/Rule";
import RecipientTable from "../../Components/IssuanceComponents/RecipientTable";
import IssuanceModal from "../../Components/Modal/IssuanceModal";

type Anchor = 'left' | 'bottom' | 'right';

const Issuance = () => {
  const navigate = useNavigate()
  const [userPosition, setUserPosition] = useState<number>()
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    let decodeToken: any
    let temp_token = getItemWithExpireTime()
    temp_token = jwt_decode(temp_token)
    decodeToken = temp_token
    setUserPosition(decodeToken.position)
    setUsername(decodeToken.name)
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
          <ListItemButton onClick={() => navigate('/rule-table')}>
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
          <ListItemButton onClick={() => navigate('/admin/add-user')}>
            <ListItemIcon>
              <RuleIcon/>
            </ListItemIcon>
            <ListItemText primary={'상벌점 규정 관리'}/>
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

  if (userPosition === 0 || userPosition === 2) {
    return (
      <div>notFound</div>
    )
  }
  else {
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
          <span className={'page-name'}><span><AiOutlineHome className={'page-name-icon'}/></span> {'>'} 점수 발급</span>
          <span><LogoutButton/></span>
          <div className={'divider-line'}/>
        </div>

        <div className={'container'}>
          <IssuanceModal/>
          <RecipientTable/>
        </div>
      </div>
    )
  }
}

export default Issuance