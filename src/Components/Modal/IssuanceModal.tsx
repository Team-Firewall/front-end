import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from 'react-spring';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiOutlineUserAdd } from 'react-icons/ai'

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

const IssuanceModal = () => {
  const [open, setOpen] = useState(false);
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [studentDivision, setStudentDivision] = useState<number>(0)
  const [grade, setGrade] = useState<number>()
  const [classNumber, setClassNumber] = useState<number>()
  const [number, setNumber] = useState<number>()
  const [name, setName] = useState<string>()

  let userArray:any = []

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
        <td><input type={"checkbox"} value={[`${i}`, 'sex']} onClick={(e: any) => userArray.push(e.target.value)}/></td>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
        <td>kim</td>
      </tr>);
    }
    return result;
  }

  return (
    <div>
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
                          <th><input type={"checkbox"}/></th>
                          <th>학생 구분</th>
                          <th>학년</th>
                          <th>반</th>
                          <th>번호</th>
                          <th>이름</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td><input type={"checkbox"} value={'id'}
                                     onClick={(e: any) => console.log(e.target.value)}/></td>
                          <td>kim</td>
                          <td>kim</td>
                          <td>kim</td>
                          <td>kim</td>
                          <td>kim</td>
                        </tr>
                        {loopTable()}
                        </tbody>
                      </table>
                    </div>
                    <div className={'button-container'}>
                      <button className={'check-btn check-btn-1'}><ImCheckboxChecked className={'icon'}/>
                        <span>전체 선택</span></button>
                      <button className={'check-btn check-btn-2'}><ImCheckboxUnchecked className={'icon'}/>
                        <span>선택 해제</span></button>
                      <button className={'add-user-btn'}><AiOutlineUserAdd className={'icon'}/> <span>발급 대상자 추가</span>
                      </button>
                    </div>
                  </div>
                )
              }

            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default IssuanceModal
