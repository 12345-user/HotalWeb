<template>
  <div class="login-container">
    <div class="login-card">
      <h2 style="display:flex;align-items:center;gap:8px">
        <img src="/images/my-logo.jpg" class="logo-icon" alt="管理员登录" />
        管理员登录
      </h2>
      <p class="subtitle">猫驼旅者客栈后台管理系统</p>
      <el-form :model="form" @keyup.enter="handleLogin">
        <el-form-item label="账号">
          <el-input 
            v-model="form.username" 
            placeholder="请输入管理员账号"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入管理员密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="验证码">
          <div style="display:flex;gap:10px;align-items:center">
            <el-input 
              v-model="form.captcha" 
              placeholder="请输入验证码"
              style="flex:1"
              clearable
              maxlength="4"
            />
            <div class="captcha-box" @click="refreshCaptcha" title="点击刷新验证码">
              <span class="captcha-text">{{ captchaCode }}</span>
            </div>
          </div>
        </el-form-item>
        <el-button type="primary" @click="handleLogin" style="width:100%">登录</el-button>
      </el-form>
      <p v-if="error" style="color:red;text-align:center;margin-top:10px">{{ error }}</p>
      <div style="margin-top:20px;text-align:center">
        <el-button @click="goBack" style="width:100%">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import auth from '../services/auth'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      error: '',
      captchaCode: ''
    }
  },
  created() {
    this.refreshCaptcha()
  },
  methods: {
    refreshCaptcha() {
      this.captchaCode = auth.generateCaptcha()
    },
    async handleLogin() {
      // 清空之前的错误信息
      this.error = ''
      
      // 验证账号
      if (!this.form.username) {
        this.error = '请输入账号'
        return
      }
      
      // 验证密码
      if (!this.form.password) {
        this.error = '请输入密码'
        return
      }
      
      // 验证验证码
      if (!this.form.captcha) {
        this.error = '请输入验证码'
        return
      }
      
      // 调用登录验证
      const result = await auth.login(
        this.form.username,
        this.form.password,
        this.form.captcha,
        this.captchaCode
      )
      
      if (result.success) {
        this.$message.success(result.message)
        this.$router.push('/admin')
      } else {
        this.error = result.message
        this.form.password = ''
        this.form.captcha = ''
        this.refreshCaptcha() // 登录失败后刷新验证码
      }
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg);
}

.login-card {
  background: var(--card);
  border-radius: 10px;
  padding: 40px;
  width: 350px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.login-card h2 {
  color: var(--accent);
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  margin-bottom: 20px;
}

.captcha-box {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.3s;
}

.captcha-box:hover {
  opacity: 0.8;
}

.captcha-text {
  color: white;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}
</style>
