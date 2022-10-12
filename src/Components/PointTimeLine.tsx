import React from "react";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Loading from "./Loading";
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import classNames from "classnames/bind";
import styles from "../Style/Timeline.module.css";
import { Timeline, TimelineItem } from "@mui/lab";

const cs = classNames.bind(styles)

const PointTimeLine = () => {
  const {data, error} = useSWR('http://localhost:8889', fetcher)
  if (error) {
    return <div>Error</div>
  } else if (!data) {
    return <Loading/>
  } else {
    return (
      <div>
        <div>
          <div>
            {/*<div>*/}
            {/*  <div>*/}
            {/*    <span>구분</span>*/}
            {/*    <span>점수</span>*/}
            {/*    <span>발급자</span>*/}
            {/*    <span>날짜</span>*/}
            {/*    <span>총점</span>*/}
            {/*  </div>*/}
            {/*</div>*/}
            <div>
              <Timeline position="alternate">
                {Object.values(data).map((log: any, index: number) => (
                  <TimelineItem>
                  <TimelineOppositeContent
                    sx={{m: 'auto 0'}}
                    variant="body2"
                    color="text.secondary"
                  >

                    <div>{log.point > 0 ? '상점' : '벌점'} {Math.abs(log.point)}점</div>
                    <div>총 {log.accumulate}점</div>
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <TimelineConnector/>
                    <TimelineDot style={{ backgroundColor: log.point < 0 ? '#ce2c2c' : '#04ad04'}}>
                      {
                        log.point < 0 ? <RemoveIcon/> : <AddIcon/>
                      }
                    </TimelineDot>
                    <TimelineConnector/>
                  </TimelineSeparator>

                  <TimelineContent sx={{py: '12px', px: 2}}>
                    <Typography variant="h6" component="span">
                      <div className={cs('division')}>{log.division}</div>
                    </Typography>
                    <Typography><span className={cs('date')}>{log.date}</span></Typography>
                  </TimelineContent>

                </TimelineItem>
                ))}
              </Timeline>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PointTimeLine