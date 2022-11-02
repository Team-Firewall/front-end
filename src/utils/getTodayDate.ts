export const getTodayDate = () => {
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date: string = String(now.getDate())

  if (String(date).length === 1) {
    date = '0' + date
  }

  let todayDate = year + '-' + month + '-' + date
  return todayDate
}