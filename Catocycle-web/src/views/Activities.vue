<template>
  <div>
    <el-row>
      <el-col :span="14">
        <h3>🎉 活动记录 | 猫咪同欢</h3>
        <el-timeline>
          <el-timeline-item v-for="act in activities" :key="act.id" :timestamp="act.time">
            <h4 style="cursor:pointer;color:var(--accent)" @click="goToActivity(act.id)">{{ act.title }} →</h4>
            <p class="small muted">参与：{{ act.people }}</p>
            <p>{{ act.desc }}</p>
            <div v-if="act.photos && act.photos.length">
              <el-image v-for="(p,i) in act.photos" :key="i" :src="p" style="width:120px;margin-right:8px" fit="cover"/>
            </div>
            <div v-if="isAdmin" style="margin-top:8px">
              <el-button type="danger" size="small" @click="deleteAct(act.id)">删除</el-button>
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
