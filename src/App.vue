<template>
  <div>
    <header class="site-header">
      <div class="logo">客栈 · 雅宿</div>
      <el-menu mode="horizontal" :default-active="$route.path" router>
        <el-menu-item index="/">主页</el-menu-item>
        <el-menu-item index="/activities">活动记录</el-menu-item>
        <el-menu-item index="/people">人员介绍</el-menu-item>
        <el-menu-item index="/items">活动物品</el-menu-item>
      </el-menu>
    </header>

    <main class="main-container">
      <router-view />
    </main>

    <footer class="footer">© 客栈展示 | 简洁 · 高级 · 温暖</footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
