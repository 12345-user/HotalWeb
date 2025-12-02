<template>
  <div>
    <el-button @click="$router.back()" class="back-btn">← 返回</el-button>
    
    <el-card v-if="activity" class="detail-card">
      <h2>{{ activity.title }}</h2>
      <div class="detail-layout">
        <div class="detail-text">
          <p><strong>📅 时间：</strong> {{ activity.time }}</p>
          <p><strong>👥 参与人员：</strong> {{ activity.people }}</p>
          <p><strong>📝 活动描述：</strong></p>
          <p class="detail-desc">{{ activity.desc }}</p>
        </div>
        <div class="detail-photo-col" v-if="activity.photos && activity.photos.length">
          <p><strong>📸 活动照片：</strong></p>
          <div class="detail-photos">
            <img
              v-for="(photo, i) in activity.photos"
              :key="i"
              :src="photo"
              class="detail-photo"
              @click="previewPhoto(photo)"
            />
          </div>
        </div>
      </div>
    </el-card>
    
    <el-empty v-else description="活动不存在"></el-empty>

    <!-- 图片预览 -->
    <el-image-viewer v-if="photoPreviewVisible" :url-list="[currentPhoto]" @close="photoPreviewVisible=false" />
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      activity: null,
      photoPreviewVisible: false,
      currentPhoto: ''
    }
  },
  async created() {
    const id = parseInt(this.$route.params.id)
    const activities = await api.getActivities()
    this.activity = activities.find(a => a.id === id)
  },
  methods: {
    previewPhoto(photo) {
      this.currentPhoto = photo
      this.photoPreviewVisible = true
    }
  }
}
</script>

<style scoped>
h2 {
  color: var(--accent);
  margin-bottom: 18px;
}

.detail-card {
  padding: 26px 28px;
}

.detail-layout {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}

.detail-text {
  flex: 0 0 52%;
}

.detail-photo-col {
  flex: 0 0 46%;
  display: flex;
  flex-direction: column;
  padding-right: 8px;
}

p {
  line-height: 1.8;
  margin: 10px 0;
  color: var(--muted);
}

strong {
  color: var(--accent);
}

.detail-desc {
  white-space: pre-wrap;
  color: var(--muted);
  margin-bottom: 0;
}

.detail-photos {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 6px;
}

.detail-photo {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn {
  margin-bottom: 16px;
  background-color: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.back-btn:hover {
  background-color: #8b623f;
  border-color: #8b623f;
  color: #fff;
}
</style>
