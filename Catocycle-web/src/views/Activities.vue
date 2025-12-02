<template>
  <div>
    <el-row>
      <el-col :span="14">
        <h3>🎉 活动记录 | 猫咪同欢</h3>
        <el-timeline>
          <el-timeline-item v-for="act in activities" :key="act.id" :timestamp="act.time">
            <div class="activity-item-outer">
              <div class="activity-item" @click="goToActivity(act.id)">
                <div class="activity-col text">
                  <h4 class="activity-title">{{ act.title }} →</h4>
                  <p class="small muted">参与：{{ act.people }}</p>
                  <p>{{ act.desc }}</p>
                </div>
                <div class="activity-col photo" v-if="act.photos && act.photos.length">
                  <el-image
                    :src="act.photos[0]"
                    class="activity-photo-thumb"
                    fit="cover"
                  />
                </div>
                <div class="activity-col link">
                  <span class="activity-more">查看详情 →</span>
                </div>
              </div>
            </div>
            <div v-if="isAdmin" style="margin-top:8px">
              <el-button type="danger" size="small" @click.stop="deleteAct(act.id)">删除</el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col v-if="isAdmin" :span="10">
        <h3>➕ 添加新活动</h3>
        <el-form label-position="top" :model="form">
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="form.time" type="datetime" placeholder="选择时间" style="width:100%" />
          </el-form-item>
          <el-form-item label="人员">
            <el-input v-model="form.people" placeholder="参与人员姓名或人数" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.desc" />
          </el-form-item>
          <el-form-item label="照片 URL（逗号分隔，例如: /images/activities/photo-1.jpg">
            <el-input v-model="form.photos" placeholder="国际URL 或 本地路径 /images/activities/..." />
          </el-form-item>
          <el-button type="primary" @click="submit">添加</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../services/api'
import auth from '../services/auth'

export default {
  data(){
    return {
      activities:[],
      form:{title:'',time:'',people:'',desc:'',photos:''},
      isAdmin: false
    }
  },
  async created(){
    this.isAdmin = auth.isAdmin()
    this.activities = await api.getActivities()
  },
  methods:{
    goToActivity(id) {
      this.$router.push(`/activity/${id}`)
    },
    async submit(){
      const payload = {
        title: this.form.title,
        time: (this.form.time && new Date(this.form.time).toLocaleString()) || new Date().toLocaleString(),
        people: this.form.people,
        desc: this.form.desc,
        photos: this.form.photos ? this.form.photos.split(',').map(s => s.trim()) : []
      }
      await api.addActivity(payload)
      this.activities = await api.getActivities()
      this.form = {title:'',time:'',people:'',desc:'',photos:''}
    },
    async deleteAct(id){
      this.$confirm('确认删除此活动记录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deleteActivity(id)
        this.activities = await api.getActivities()
        this.$message.success('活动已删除')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.activity-item-outer {
  padding: 6px;
  border-radius: 14px;
  border: 1px solid rgba(160, 117, 74, 0.35);
  background: linear-gradient(
    135deg,
    rgba(245, 237, 227, 0.9),
    rgba(212, 181, 160, 0.5)
  );
}

.activity-item {
  cursor: pointer;
  border: 1px solid rgba(160, 117, 74, 0.25);
  border-radius: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.activity-title {
  color: var(--accent);
  margin-top: 0;
}

.activity-more {
  font-size: 12px;
  color: var(--muted);
}

.activity-col.text {
  flex: 1;
}

.activity-col.photo {
  flex-shrink: 0;
}

.activity-photo-thumb {
  width: 150px;
  height: 110px;
  border-radius: 8px;
}

.activity-col.link {
  flex-shrink: 0;
}
</style>
