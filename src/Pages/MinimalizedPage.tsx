import React from 'react';
import classNames from "classnames/bind"
import styles from '../Style/MinimalizedPage.module.css'
import browserSizeBigger from '../images/browser-size-bigger.jpeg'
import Tilt from 'react-parallax-tilt';

const cs = classNames.bind(styles)

const MinimalizedPage = () => {
  return (
    <div className={cs('background')}>
      <div className={cs('container')}>
        <Tilt>
          <div className={cs('sub-container')}>
            <div className={cs('img-tag')}>
              <img src={browserSizeBigger} alt={'브라우저의 화면 크기를 키워주세요.'}/>
            </div>
            <div className={cs('text-container')}>
              <div className={cs('text')}>
                <div className={cs('top-div')}>화면이 너무 작아요 !</div>
                <div className={cs('bottom-div')}>브라우저의 화면 크기를 늘여주세요.</div>
              </div>
            </div>
          </div>
        </Tilt>
      </div>
    </div>
  );
}

export default MinimalizedPage;