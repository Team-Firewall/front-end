export const setItemWithExpireTime = (keyValue: string) => {
  const obj = {
    value: keyValue,
    expires: Date.now() + 10000000
  }

  const objString = JSON.stringify(obj)
  window.localStorage.setItem('item', objString)
}

export const getItemWithExpireTime = () => {
  const objString = window.localStorage.getItem('item');
  if (!objString) {
    return null
  }
  const obj = JSON.parse(objString)

  if (Date.now() > obj.expires) {
    alert('세션이 만료되었습니다. 계속하려면 다시 로그인 하세요.')
    window.location.replace('/')
    window.localStorage.removeItem('item')
    return null
  }
  return obj.value;
}

export const Logout = () => {
  if (window.confirm('로그아웃 하시겠습니까?')) {
    window.location.replace('/')
  }
  return null
}
