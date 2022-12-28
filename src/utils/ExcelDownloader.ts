import * as XLSX from "xlsx"
import * as FileSaver from "file-saver"

const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const excelFileExtension = '.xlsx'

const getTodayDate = () => {
  const date = new Date()
  let month: any = date.getMonth() + 1
  let day: any = date.getDate()
  let hour: any = date.getHours()
  let minute: any = date.getMinutes()
  let second: any = date.getSeconds()

  month = month >= 10 ? month : '0' + month
  day = day >= 10 ? day : '0' + day
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  second = second >= 10 ? second : '0' + second

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + '_' + minute + '_' + second + '_'
}

const dateFormat = (date: Date) => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  return year + '-' + month + '-' + day
}

export function ExcelDownloader (excelData: any, title: string, startDate?: Date, endDate?: Date) {
  const excelFileName = title + ' ' + getTodayDate();
  if (startDate && endDate) {
    const ws = XLSX.utils.aoa_to_sheet([
      [`상벌점 발급내역 (${dateFormat(startDate)} ~ ${dateFormat(endDate)})`],
      [],
      ['제목', '내용']
    ]);
    excelData.map((data: any) => {
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          [
            data.grade,
            data.class,
            data.number,
            data.name,
            data.checked,
            data.regulate,
            data.score,
            data.issuer,
            data.createdDate
          ]
        ],
        {origin: -1}
      );
      ws['!cols'] = [
        {wpx: 200},
        {wpx: 200}
      ]
      return false;
    })
    const wb: any = {Sheets: {data: ws}, SheetNames: ['data']};
    const excelButter = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
    const excelFile = new Blob([excelButter], {type: excelFileType});
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
  }
}