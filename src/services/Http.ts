import * as request from 'request'

const host: string = 'http://127.0.0.1:3008'

function setCookie(cookie: string[]) {
  let localCookie = JSON.parse(localStorage.getItem('cookie')) || {}
  cookie.forEach(item => {
    let arr = item.split(';')
    let tmp = arr[0].split('=')
    localCookie[tmp[0]] = tmp[1]
  })
  localStorage.setItem('cookie', JSON.stringify(localCookie))
}

function getCookie() {
  let cookies = JSON.parse(localStorage.getItem('cookie') || '{}')
  let str = ''
  for (let key in cookies) {
    str += `${key}=${cookies[key]}; `
  }
  return str
}

/**
 * node http 请求服务封装
 * @param url 
 */
export function get<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    let client = request.get(`${host}${url}`, {
      headers: {
        cookie: getCookie()
      },
      json: true
    }, (err, response, body) => {
      let cookie = response && response.headers && response.headers['set-cookie']
      if (cookie) {
        setCookie(cookie)
      }
      resolve(body)
    })
  })
}