<template>
  <div class="login-container">
    <div class="login-card">
      <h2 style="display:flex;align-items:center;gap:8px">
        <img src="/images/my-logo.jpg" class="logo-icon" alt="管理员登录" />
        管理员登录
      </h2>
      <p class="subtitle">猫驼旅者客栈后台管理系统</p>
      <el-form :model="form" @keyup.enter="handleLogin">
        <el-form-item label="密码">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入管理员密码"
            show-password
          />
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
        password: ''
      },
      error: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.form.password) {
        this.error = '请输入密码'
        return
      }
      
      if (auth.login(this.form.password)) {
        this.$message.success('登录成功')
        this.$router.push('/admin')
      } else {
        this.error = '密码错误'
        this.form.password = ''
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
</style>
