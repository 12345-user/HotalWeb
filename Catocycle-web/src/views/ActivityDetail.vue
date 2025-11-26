<template>
  <div>
    <el-button @click="$router.back()" type="info" style="margin-bottom:20px">← 返回</el-button>
    
    <el-card v-if="activity">
      <h2>{{ activity.title }}</h2>
      <div style="margin-top:20px">
        <p><strong>📅 时间：</strong> {{ activity.time }}</p>
        <p><strong>👥 参与人员：</strong> {{ activity.people }}</p>
        <p><strong>📝 活动描述：</strong></p>
        <p style="white-space: pre-wrap; color: var(--muted)">{{ activity.desc }}</p>
        
        <div v-if="activity.photos && activity.photos.length" style="margin-top:20px">
          <p><strong>📸 活动照片：</strong></p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin-top:10px">
            <img 
              v-for="(photo, i) in activity.photos" 
              :key="i" 
              :src="photo" 
              style="width:100%;height:200px;object-fit:cover;border-radius:8px;cursor:pointer"
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
  margin-bottom: 20px;
}

p {
  line-height: 1.8;
  margin: 10px 0;
  color: var(--muted);
}

strong {
  color: var(--accent);
}
</style>
