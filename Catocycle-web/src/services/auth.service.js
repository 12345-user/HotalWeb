import http from './http'

const ADMIN_TOKEN_KEY = 'adminToken'

export function isAdmin() {
  return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY))
}

export function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function login(username, password, captcha, correctCaptcha) {
  if (!captcha || captcha !== correctCaptcha) {
    return { success: false, message: '验证码错误' }
  }

  try {
    const { data } = await http.post('/auth/login', { username, password })
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
    return { success: true, message: '登录成功' }
  } catch (error) {
    const message = error?.response?.data?.message || '登录失败'
    return { success: false, message }
  }
}

export async function verifyAdmin() {
  if (!isAdmin()) return false
  try {
    await http.get('/auth/me')
    return true
  } catch (_) {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    return false
  }
}

export async function logout() {
  try {
    if (isAdmin()) {
      await http.post('/auth/logout')
    }
  } catch (_) {
    // Ignore logout API errors and clear local token anyway.
  } finally {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
  }
}
