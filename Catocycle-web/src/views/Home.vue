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
            <h2 style="color:var(--accent);display:flex;align-items:center;gap:8px">
              <img src="/images/my-logo.jpg" class="logo-icon" alt="猫驼旅者客栈" />
              猫驼旅者客栈
            </h2>
            <p class="muted small">温馨舒适 · 手工手作 · 良辰好景 · 猫咪陪伴</p>
            <el-card style="margin-top:12px">
              <p>欢迎来到猫驼旅者客栈。我们重视慢时光与人情味，还有组织手工体验与文化交流活动，欢迎关注小红书和抖音账号。</p>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </section>

    <section style="margin-top:14px">
      <h3>🎉 特色活动</h3>
      <div v-if="recentActivities.length" class="featured-activities">
        <!-- 左侧第一条活动 -->
        <div class="featured-slot">
          <el-card
            class="featured-card"
            @click="goToActivity(recentActivities[0].id)"
          >
            <h4 class="featured-title">{{ recentActivities[0].title }}</h4>
            <div
              v-if="recentActivities[0].photos && recentActivities[0].photos.length"
              class="featured-photo-wrap"
            >
              <el-image
                :src="recentActivities[0].photos[0]"
                class="featured-photo"
                fit="cover"
              />
            </div>
          </el-card>
        </div>

        <!-- 右侧预留位置：当有第二条活动时显示，否则留白 -->
        <div class="featured-slot" v-if="recentActivities[1]">
          <el-card
            class="featured-card"
            @click="goToActivity(recentActivities[1].id)"
          >
            <h4 class="featured-title">{{ recentActivities[1].title }}</h4>
            <div
              v-if="recentActivities[1].photos && recentActivities[1].photos.length"
              class="featured-photo-wrap"
            >
              <el-image
                :src="recentActivities[1].photos[0]"
                class="featured-photo"
                fit="cover"
              />
            </div>
          </el-card>
        </div>
        <div
          class="featured-slot placeholder"
          v-else
        ></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.featured-activities {
  display: flex;
  justify-content: flex-start;
  gap: 24px;
}

.featured-slot {
  flex: 0 0 50%;
}

.featured-slot.placeholder {
  /* 预留空位，不显示内容 */
}

.featured-card {
  width: 100%;
  cursor: pointer;
  text-align: center;
}

.featured-title {
  color: var(--accent);
  margin-bottom: 10px;
}

.featured-photo-wrap {
  padding: 4px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(160, 117, 74, 0.9), rgba(245, 237, 227, 0.9));
}

.featured-photo {
  width: 100%;
  height: 230px;
  border-radius: 10px;
  object-fit: cover;
  display: block;
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
