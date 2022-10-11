let access_token: string = ''

export const setItemWithExpireTime = (keyName: string, keyValue: string) => {
  const obj = {
    value: keyValue,
    expires: Date.now() + 10000
  }

  const objString = JSON.stringify(obj)
  window.localStorage.setItem(keyName, objString)
}

export const getItemWithExpireTime = (keyName: string) => {
  const objString = window.localStorage.getItem(keyName);
  if (!objString) {
    return null
  }
  const obj = JSON.parse(objString)

  if (Date.now() > obj.expires) {
    alert('인증 시간 만료')
    window.location.replace('/')
    window.localStorage.removeItem(keyName)
    return null
  }
  return obj.value;
}
