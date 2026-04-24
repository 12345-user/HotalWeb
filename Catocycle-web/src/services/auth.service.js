const ADMIN_USERNAME = 'mtkz520103'
const ADMIN_PASSWORD = '12345678'
const ADMIN_FLAG_KEY = 'isAdmin'

export function isAdmin() {
  return localStorage.getItem(ADMIN_FLAG_KEY) === 'true'
}

export function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export function login(username, password, captcha, correctCaptcha) {
  if (username !== ADMIN_USERNAME) {
    return { success: false, message: '账号错误' }
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, message: '密码错误' }
  }

  if (!captcha || captcha !== correctCaptcha) {
    return { success: false, message: '验证码错误' }
  }

  localStorage.setItem(ADMIN_FLAG_KEY, 'true')
  return { success: true, message: '登录成功' }
}

export function logout() {
  localStorage.removeItem(ADMIN_FLAG_KEY)
}
