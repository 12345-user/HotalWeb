<template>
  <div>
    <header class="site-header" v-if="$route.path !== '/login'">
      <div class="logo">
        <img src="/images/my-logo.jpg" class="logo-icon" alt="猫驼旅者客栈" />
        猫驼旅者客栈
      </div>
      <el-menu mode="horizontal" :default-active="$route.path" router :ellipsis="false">
        <el-menu-item index="/">主页</el-menu-item>
        <el-menu-item index="/activities">🎉 活动记录</el-menu-item>
        <el-menu-item index="/people">👥 人员介绍</el-menu-item>
        <el-menu-item index="/items">🎁 活动物品</el-menu-item>
      </el-menu>
      <div class="admin-section">
        <span v-if="isAdmin" style="color:var(--accent);margin-right:10px">👤 管理员</span>
        <el-button v-if="isAdmin" type="danger" size="small" @click="handleLogout">登出</el-button>
        <el-button v-else type="primary" size="small" @click="$router.push('/login')">管理员</el-button>
      </div>
    </header>

    <main class="main-container">
      <router-view />
    </main>

    <footer class="footer" v-if="$route.path !== '/login'">© 猫驼旅者客栈 | 简洁 · 高级 · 温暖 · 呵~</footer>
  </div>
</template>

<script>
import auth from './services/auth'

export default {
  name: 'App',
  data() {
    return {
      isAdmin: false
    }
  },
  watch: {
    $route() {
      this.checkAdmin()
    }
  },
  created() {
    this.checkAdmin()
  },
  methods: {
    checkAdmin() {
      this.isAdmin = auth.isAdmin()
    },
    handleLogout() {
      auth.logout()
      this.isAdmin = false
      this.$message.success('已登出')
      this.$router.push('/')
    }
  }
}
</script>
