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
                  <el-button type="primary" size="small" @click="editPerson(p)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deletePer(p.id)">删除</el-button>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="8">
            <h3>{{ perFormMode === 'edit' ? '✏️ 编辑人员' : '➕ 添加新人员' }}</h3>
            <el-form label-position="top" :model="perForm">
              <el-form-item label="姓名"><el-input v-model="perForm.name"/></el-form-item>
              <el-form-item label="性格"><el-input v-model="perForm.personality"/></el-form-item>
              <el-form-item label="技能"><el-input v-model="perForm.skills"/></el-form-item>
              <el-form-item label="联系方式"><el-input v-model="perForm.contact"/></el-form-item>
              <el-form-item label="照片">
                <div v-if="perForm.imagePreview" style="margin-bottom:8px">
                  <el-image :src="perForm.imagePreview" style="width:180px;height:140px;border-radius:8px" fit="cover"/>
                  <p class="small muted" style="margin-top:4px">建议路径：{{ perForm.suggestedPath }}</p>
                </div>
                <input type="file" accept="image/*" @change="onPersonFileChange" style="margin-bottom:8px"/>
                <el-input 
                  v-model="perForm.photos" 
                  placeholder="照片路径，如：/images/person/person1.jpg（多个用逗号分隔）"
                  style="margin-top:8px"
                />
                <p class="small muted" style="margin-top:4px">💡 上传图片后会自动生成路径建议，请将图片保存到 public/images/person 目录</p>
              </el-form-item>
              <div style="margin-top:12px">
                <el-button type="primary" @click="submitPerson">{{ perFormMode === 'edit' ? '保存' : '添加' }}</el-button>
                <el-button v-if="perFormMode === 'edit'" @click="cancelEditPerson">取消</el-button>
              </div>
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
      perForm: {name:'',personality:'',skills:'',contact:'',photos:'',imagePreview:'',suggestedPath:''},
      perFormMode: 'add', // 'add' | 'edit'
      editingPersonId: null
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
    onPersonFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if(!file) return
      const reader = new FileReader()
      reader.onload = () => {
        this.perForm.imagePreview = reader.result
        // 自动生成建议路径：/images/person/person{id或name}.jpg
        const name = this.perForm.name || 'person'
        const sanitizedName = name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
        const fileExt = file.name.split('.').pop() || 'jpg'
        this.perForm.suggestedPath = `/images/person/${sanitizedName}.${fileExt}`
        // 如果 photos 为空，自动填入建议路径
        if (!this.perForm.photos) {
          this.perForm.photos = this.perForm.suggestedPath
        }
      }
      reader.readAsDataURL(file)
    },
    editPerson(person) {
      this.perFormMode = 'edit'
      this.editingPersonId = person.id
      this.perForm = {
        name: person.name || '',
        personality: person.personality || '',
        skills: person.skills || '',
        contact: person.contact || '',
        photos: person.photos ? person.photos.join(',') : '',
        imagePreview: person.photos && person.photos.length ? person.photos[0] : '',
        suggestedPath: person.photos && person.photos.length ? person.photos[0] : ''
      }
      // 滚动到表单
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEditPerson() {
      this.clearPersonForm()
    },
    clearPersonForm() {
      this.perForm = {name:'',personality:'',skills:'',contact:'',photos:'',imagePreview:'',suggestedPath:''}
      this.perFormMode = 'add'
      this.editingPersonId = null
      // 清空文件输入
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
    },
    async submitPerson() {
      if (!this.perForm.name) {
        this.$message.warning('请输入姓名')
        return
      }
      const payload = {
        name: this.perForm.name,
        personality: this.perForm.personality || '',
        skills: this.perForm.skills || '',
        contact: this.perForm.contact || '',
        photos: this.perForm.photos ? this.perForm.photos.split(',').map(s => s.trim()).filter(s => s) : []
      }
      
      if (this.perFormMode === 'edit') {
        payload.id = this.editingPersonId
        await api.updatePerson(payload)
        this.$message.success('人员信息已更新')
      } else {
        await api.addPerson(payload)
        this.$message.success('人员添加成功')
      }
      
      this.people = await api.getPeople()
      this.clearPersonForm()
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
