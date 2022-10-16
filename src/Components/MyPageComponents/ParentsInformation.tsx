import React from 'react'
import styles from '../../Style/Components.module.css'
import classNames from "classnames/bind";

const cs = classNames.bind(styles)

const ParentsInformation = () => {
  return (
    <div className={cs('user-information-box')}>
      <div className={'main-heading'} style={{ color: '#0c849d' }}>보호자 정보</div>
      <div className={cs('basic-information-container')}>
        <div className={'subheading'} style={{ color: '#0252ab' }}>학부모 연락처</div>
        <div className={'division'}>학부모1 전화번호</div>
        <div className={cs('general-sentence')}>010-1234-5678</div>
        <div className={'division'}>학부모2 전화번호</div>
        <div className={cs('general-sentence')}>010-1234-5678</div>
      </div>

      <div className={cs('point-information-container')}>
        <div className={'subheading'} style={{ color: '#0252ab' }}>담임선생님 연락처</div>
        <div className={'division'}>선생님 성함</div>
        <div className={cs('general-sentence')}>남소율 선생님</div>
        <div className={'division'}>선생님 연락처</div>
        <div className={cs('general-sentence')}>010-1234-5678</div>
      </div>

      <div className={cs('exclamation-phrases')}>* 보호자 전화번호가 등록되지 않거나 정보가 올바르지 않으면 선생님께 문의해 주세요.</div>
    </div>
  )
}

export default ParentsInformation