<template>
  <div>
    <section class="hero">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-carousel height="320px" indicator-position="outside">
            <el-carousel-item v-for="(img,i) in images" :key="i">
              <div style="height:320px;background-size:cover;background-position:center;border-radius:8px" :style="{backgroundImage: 'url('+img+')'}"></div>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="8">
          <div style="padding:12px">
            <h2 style="color:var(--accent)">🐱 猫驼旅者客栈</h2>
            <p class="muted small">淡棕色调 · 温暖舒适 · 手作茶点 · 良辰好景 · 猫咪陪伴</p>
            <el-card style="margin-top:12px">
              <p>欢迎来到猫驼旅者客栈。我们重视慢时光与人情味，还有可爱的猫咪陪伴，定期举办文化与交流活动，欢迎关注活动记录。</p>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </section>

    <section style="margin-top:14px">
      <h3>🎉 特色活动</h3>
      <div class="card-grid">
        <el-card v-for="act in recentActivities" :key="act.id" class="activity-card" @click="goToActivity(act.id)">
          <h4>{{ act.title }}</h4>
          <p class="small muted">时间：{{ act.time }}</p>
          <p class="small muted">参与：{{ act.people }}</p>
          <p style="color:var(--muted);margin-top:8px">{{ act.desc.substring(0, 60) }}...</p>
          <p style="text-align:right;color:var(--accent);margin-top:10px;cursor:pointer">查看详情 →</p>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.activity-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(160, 117, 74, 0.15);
}

.small {
  font-size: 13px;
}

.muted {
  color: var(--muted);
}
</style>

<script>
import api from '../services/api'

export default {
  data(){
    return {
      images:[
        '/images/carousel/p1.jpg',
        '/images/carousel/p2.jpg',
        '/images/carousel/p3.jpg'
      ],
      recentActivities: []
    }
  },
  async created() {
    // 获取最近的活动（取前3条）
    const activities = await api.getActivities()
    this.recentActivities = activities.slice(0, 3)
  },
  methods: {
    goToActivity(id) {
      this.$router.push(`/activity/${id}`)
    }
  }
}
</script>
