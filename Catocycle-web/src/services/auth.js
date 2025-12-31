// 简单的管理员认证服务 - 使用 localStorage 存储登录状态
export default {
  // 检查是否已登录
  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true'
  },

  // 生成验证码（4位数字）
  generateCaptcha() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  },

  // 管理员登录（账号+密码+验证码验证）
  login(username, password, captcha, correctCaptcha) {
    // 验证账号和密码
    const adminUsername = 'mtkz520103'
    const adminPassword = '12345678'
    
    // 验证账号
    if (username !== adminUsername) {
      return { success: false, message: '账号错误' }
    }
    
    // 验证密码
    if (password !== adminPassword) {
      return { success: false, message: '密码错误' }
    }
    
    // 验证验证码
    if (!captcha || captcha !== correctCaptcha) {
      return { success: false, message: '验证码错误' }
    }
    
    // 登录成功
    localStorage.setItem('isAdmin', 'true')
    return { success: true, message: '登录成功' }
  },

  // 登出
  logout() {
    localStorage.removeItem('isAdmin')
  }
}
