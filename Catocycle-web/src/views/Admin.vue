<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2>📊 管理员面板</h2>
      <el-button type="danger" @click="handleLogout">登出</el-button>
    </div>

    <el-tabs>
      <!-- 活动管理 -->
      <el-tab-pane label="🎉 活动管理">
        <el-row>
          <el-col :span="14">
            <h3>活动列表</h3>
            <el-timeline>
              <el-timeline-item v-for="act in activities" :key="act.id" :timestamp="act.time">
                <h4>{{ act.title }}</h4>
                <p class="small muted">参与：{{ act.people }}</p>
                <p>{{ act.desc }}</p>
                <div style="margin-top:8px">
                  <el-button type="danger" size="small" @click="deleteAct(act.id)">删除</el-button>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-col>
          <el-col :span="10">
            <h3>➕ 添加新活动</h3>
            <el-form label-position="top" :model="actForm">
              <el-form-item label="标题">
                <el-input v-model="actForm.title" />
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker v-model="actForm.time" type="datetime" placeholder="选择时间" style="width:100%" />
              </el-form-item>
              <el-form-item label="人员">
                <el-input v-model="actForm.people" placeholder="参与人员姓名或人数" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="actForm.desc" />
              </el-form-item>
              <el-form-item label="照片 URL（逗号分隔）">
                <el-input v-model="actForm.photos" placeholder="国际URL 或 本地路径 /images/activities/..." />
              </el-form-item>
              <el-button type="primary" @click="submitActivity">添加</el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 人员管理 -->
      <el-tab-pane label="👥 人员管理">
        <el-row>
          <el-col :span="16">
            <h3>人员列表</h3>
            <div class="card-grid">
              <el-card v-for="p in people" :key="p.id">
                <div v-if="p.photos && p.photos.length" style="margin-bottom:12px">
                  <el-image v-for="(photo, i) in p.photos" :key="i" :src="photo" style="width:100%;height:150px;object-fit:cover;border-radius:8px;margin-bottom:8px" fit="cover"/>
                </div>
                <h4>{{ p.name }}</h4>
                <p class="small muted">性格：{{ p.personality }}</p>
                <p class="small muted">技能：{{ p.skills }}</p>
                <p class="small muted">联系方式：{{ p.contact }}</p>
                <div style="margin-top:10px">
                  <el-button type="danger" size="small" @click="deletePer(p.id)">删除</el-button>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
            <h3>➕ 添加新人员</h3>
            <el-form label-position="top" :model="perForm">
              <el-form-item label="姓名"><el-input v-model="perForm.name"/></el-form-item>
              <el-form-item label="性格"><el-input v-model="perForm.personality"/></el-form-item>
              <el-form-item label="技能"><el-input v-model="perForm.skills"/></el-form-item>
              <el-form-item label="联系方式"><el-input v-model="perForm.contact"/></el-form-item>
              <el-form-item label="照片 URL（逗号分隔）">
                <el-input v-model="perForm.photos" placeholder="国际URL 或 本地路径 /images/activities/..." />
              </el-form-item>
              <el-button type="primary" @click="submitPerson">添加</el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '../services/api'
import auth from '../services/auth'

export default {
  data() {
    return {
      activities: [],
      people: [],
      actForm: {title:'',time:'',people:'',desc:'',photos:''},
      perForm: {name:'',personality:'',skills:'',contact:'',photos:''}
    }
  },
  async created() {
    // 检查是否登录
    if (!auth.isAdmin()) {
      this.$router.push('/login')
      return
    }
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.activities = await api.getActivities()
      this.people = await api.getPeople()
    },
    async submitActivity() {
      const payload = {
        title: this.actForm.title,
        time: (this.actForm.time && new Date(this.actForm.time).toLocaleString()) || new Date().toLocaleString(),
        people: this.actForm.people,
        desc: this.actForm.desc,
        photos: this.actForm.photos ? this.actForm.photos.split(',').map(s => s.trim()) : []
      }
      await api.addActivity(payload)
      this.activities = await api.getActivities()
      this.actForm = {title:'',time:'',people:'',desc:'',photos:''}
      this.$message.success('活动添加成功')
    },
    async deleteAct(id) {
      this.$confirm('确认删除此活动？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deleteActivity(id)
        this.activities = await api.getActivities()
        this.$message.success('活动已删除')
      }).catch(() => {})
    },
    async submitPerson() {
      const payload = {
        ...this.perForm,
        photos: this.perForm.photos ? this.perForm.photos.split(',').map(s => s.trim()) : []
      }
      await api.addPerson(payload)
      this.people = await api.getPeople()
      this.perForm = {name:'',personality:'',skills:'',contact:'',photos:''}
      this.$message.success('人员添加成功')
    },
    async deletePer(id) {
      this.$confirm('确认删除此人员？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deletePerson(id)
        this.people = await api.getPeople()
        this.$message.success('人员已删除')
      }).catch(() => {})
    },
    handleLogout() {
      auth.logout()
      this.$message.success('已登出')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
h2 {
  color: var(--accent);
}

h3 {
  color: var(--accent);
  margin-bottom: 15px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.small {
  font-size: 13px;
}

.muted {
  color: var(--muted);
}
</style>
