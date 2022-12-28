import React, { useEffect, useState } from 'react'
import axios, { AxiosResponse } from "axios";
import Loading from "../Loading";
import { MdSearch, MdSearchOff } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import { ExcelDownloader } from "../../utils/ExcelDownloader";
import { RiFileExcel2Fill } from "react-icons/ri";
import LinesEllipsis from "react-lines-ellipsis";

interface regulateTotalType {
  checked: string,
  count: string,
  division: string,
  id: number,
  regulate: string,
  score: string,
  sum: string
}

const ItemStatistics = () => {
  const arrowUpButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, true)}>
        ▲
      </button>)
  }

  const arrowDownButton = (title: string) => {
    return (
      <button className={'sort-btn'} onClick={() => handleValueSort(title, false)}>
        ▼
      </button>
    )
  }

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<regulateTotalType[]>([])
  const [regulateTotal, setRegulateTotal] = useState<regulateTotalType[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)

  const [headContent, setHeadContent] = useState([
    {'title': 'id', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'checked', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'division', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'regulate', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'score', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'count', 'isHover': false, 'order': true, 'textValue': ''},
    {'title': 'sum', 'isHover': false, 'order': true, 'textValue': ''}
  ])

  useEffect(() => {
    axios.get('http://localhost:3001/v1/regulate/total')
      .then((res: AxiosResponse<any>) => {
        if (res.status === 200) {
          setResponseData(res.data.data)
          setRegulateTotal(res.data.data)
        }
      })
      .then(() => setIsLoading(false))
      .catch(() => setIsError(true))
  }, [])

  const handleValueSort = (title: string, asc: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, order: asc ? true : false} : v
    ))

    if (title === 'id') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.id > b.id) ? 1 : -1 : (a.id < b.id) ? 1 : -1)
    } else if (title === 'checked') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.checked > b.checked) ? 1 : -1 : (a.checked < b.checked) ? 1 : -1)
    } else if (title === 'division') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.division > b.division) ? 1 : -1 : (a.division < b.division) ? 1 : -1)
    } else if (title === 'regulate') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.regulate > b.regulate) ? 1 : -1 : (a.regulate < b.regulate) ? 1 : -1)
    } else if (title === 'score') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.score > b.score) ? 1 : -1 : (a.score < b.score) ? 1 : -1)
    } else if (title === 'count') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.count > b.count) ? 1 : -1 : (a.count < b.count) ? 1 : -1)
    } else if (title === 'sum') {
      regulateTotal.sort((a: regulateTotalType, b: regulateTotalType) => asc ? (a.sum > b.sum) ? 1 : -1 : (a.sum < b.sum) ? 1 : -1)
    }

    setRegulateTotal([...regulateTotal])
  }

  const handleMouseOver = (title: string, hover: boolean) => {
    setHeadContent(headContent.map((v: any) =>
      v.title === title ? {...v, isHover: hover ? true : false} : v
    ))
  }

  const changeTextValue = (title: string, textValue: string) => {
    setTimeout(() => {
      setHeadContent(headContent.map((v: any) =>
        v.title === title ? {...v, textValue: textValue} : v
      ))
    }, 500)
  }

  const searchHandler = () => {
    setHeadContent(headContent.map((it) =>
      it ? {...it, textValue: ''} : it
    ))
    setIsSearchOpen(!isSearchOpen)
  }

  if (isLoading) return <Loading/>
  else if (isError) return <h1>Error</h1>
  else {
    return (
      <div className={'container'} style={{width: '100%', height: '70vh'}}>
        <div className={'management-table-container'}>
          <table style={{width: '99.5%', margin: 'auto'}}>
            <thead>
            <tr>
              <th style={{width: '3%', borderTopLeftRadius: '5px'}}>
                <span onMouseOver={() => handleMouseOver('id', true)}
                      onMouseLeave={() => handleMouseOver('id', false)}>
                  항 {headContent[0].isHover ? headContent[0].order ? arrowDownButton('id') : arrowUpButton('id') : ''}
                  </span>
              </th>

              <th style={{width: '3%'}}>
                <span onMouseOver={() => handleMouseOver('checked', true)}
                      onMouseLeave={() => handleMouseOver('checked', false)}>
                  구분 {headContent[1].isHover ? headContent[1].order ? arrowDownButton('checked') : arrowUpButton('checked') : ''}
                  </span>
              </th>

              <th style={{width: '6%'}}>
                <span onMouseOver={() => handleMouseOver('division', true)}
                      onMouseLeave={() => handleMouseOver('division', false)}>
                  분류 {headContent[2].isHover ? headContent[2].order ? arrowDownButton('division') : arrowUpButton('division') : ''}
                </span>
              </th>

              <th style={{width: '40%'}}>
                <span onMouseOver={() => handleMouseOver('regulate', true)}
                      onMouseLeave={() => handleMouseOver('regulate', false)}>
                  항목 {headContent[3].isHover ? headContent[3].order ? arrowDownButton('regulate') : arrowUpButton('regulate') : ''}
                </span>
              </th>

              <th style={{width: '3%'}}>
                <span onMouseOver={() => handleMouseOver('score', true)}
                      onMouseLeave={() => handleMouseOver('score', false)}>
                  점수 {headContent[4].isHover ? headContent[4].order ? arrowDownButton('score') : arrowUpButton('score') : ''}
                </span>
              </th>

              <th style={{width: '5%'}}>
                <span onMouseOver={() => handleMouseOver('count', true)}
                      onMouseLeave={() => handleMouseOver('count', false)}>
                  발급 횟수 {headContent[5].isHover ? headContent[5].order ? arrowDownButton('count') : arrowUpButton('count') : ''}
                </span>
              </th>

              <th style={{width: '5%', borderTopRightRadius: '5px'}}>
                <span onMouseOver={() => handleMouseOver('sum', true)}
                      onMouseLeave={() => handleMouseOver('sum', false)}>
                  발급 총합 {headContent[6].isHover ? headContent[6].order ? arrowDownButton('sum') : arrowUpButton('sum') : ''}
                </span>
              </th>

            </tr>
            </thead>

            <tbody>
            {
              isSearchOpen && (<tr className={'search-tr'}>
                <td><input onChange={(e) => changeTextValue('id', e.target.value)}
                           maxLength={4}/></td>
                <td><input onChange={(e) => changeTextValue('checked', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('division', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('regulate', e.target.value)}
                           maxLength={1}/></td>
                <td><input onChange={(e) => changeTextValue('score', e.target.value)}
                           maxLength={4}/></td>
                <td><input onChange={(e) => changeTextValue('count', e.target.value)}
                           maxLength={3}/></td>
                <td><input onChange={(e) => changeTextValue('sum', e.target.value)}
                           maxLength={3}/></td>
              </tr>)
            }
            {Object.values(regulateTotal).map((v: any, i: number) => (
              <tr key={i} className={'border-tr'}>
                <td className={headContent[0].textValue ? 'search-active' : ''}>{v.id}</td>
                <td className={headContent[1].textValue ? 'search-active' : ''}>{v.checked}</td>
                <td className={headContent[2].textValue ? 'search-active' : ''}>{v.division}</td>
                <td className={headContent[3].textValue ? 'search-active' : ''}
                    style={{textAlign: 'left', paddingLeft: '1rem', paddingRight: '1rem'}}>
                  <LinesEllipsis
                    text={v.regulate}
                    maxLine='1'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                  />
                </td>
                <td className={headContent[4].textValue ? 'search-active' : ''}>{v.score}</td>
                <td className={headContent[5].textValue ? 'search-active' : ''}>{v.count}회</td>
                <td className={headContent[6].textValue ? 'search-active' : ''}>{v.sum}점</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={'search-button-container'}>
          <button style={{float: 'left', marginLeft: '0'}} className={'search-btn'}
                  onClick={searchHandler}>
            {
              isSearchOpen ? (<><MdSearchOff className={'icon, search-icon'}/> 검색 닫기</>) :
                (<><MdSearch className={'icon, search-icon'}/> 검색하기</>)
            }
          </button>
          <button className={'print-btn'}><BsFillPrinterFill className={'icon'}/> 인쇄하기</button>
          <button className={'excel-btn'}
                  onClick={() => ExcelDownloader(regulateTotal, '발급내역')}>
            <RiFileExcel2Fill className={'icon'}/> 엑셀로 저장
          </button>
        </div>
      </div>
    )
  }
}

export default ItemStatistics