// 简单的管理员认证服务 - 使用 localStorage 存储登录状态
export default {
  // 检查是否已登录
  isAdmin() {
    return localStorage.getItem('isAdmin') === 'true'
  },

  // 管理员登录（简单密码验证）
  login(password) {
    const adminPassword = '123456' // 简单密码，可修改
    if (password === adminPassword) {
      localStorage.setItem('isAdmin', 'true')
      return true
    }
    return false
  },

  // 登出
  logout() {
    localStorage.removeItem('isAdmin')
  }
}
