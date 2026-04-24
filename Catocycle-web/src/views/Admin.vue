<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2>📊 管理员面板</h2>
      <el-button type="danger" @click="handleLogout">登出</el-button>
    </div>

    <el-tabs>
      <!-- 活动管理 -->
      <el-tab-pane label="🎉 活动管理">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :md="14" :lg="14">
            <div class="activity-list-section">
              <h3>活动列表</h3>
              <el-timeline class="activity-timeline">
                <el-timeline-item v-for="act in activities" :key="act.id" :timestamp="act.time" class="activity-item">
                  <el-card class="activity-card">
                    <h4 class="activity-title">{{ act.title }}</h4>
                    <p class="small muted" v-if="act.people">参与：{{ act.people }}</p>
                    <p v-if="act.desc" class="activity-desc">{{ act.desc }}</p>
                    <div v-if="act.photos && act.photos.length" class="activity-photos" style="margin-top:12px">
                      <el-image 
                        v-for="(photo, i) in act.photos" 
                        :key="i" 
                        :src="photo" 
                        class="activity-photo-thumb"
                        fit="cover"
                      />
                    </div>
                    <div class="activity-actions" style="margin-top:12px">
                      <el-button type="primary" size="small" @click="editActivity(act)">编辑</el-button>
                      <el-button type="danger" size="small" @click="deleteAct(act.id)">删除</el-button>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10">
            <div class="activity-form-section">
              <h3>{{ actFormMode === 'edit' ? '✏️ 编辑活动' : '➕ 添加新活动' }}</h3>
              <el-card class="activity-form-card">
                <el-form label-position="top" :model="actForm" class="activity-form">
                  <el-form-item label="标题">
                    <el-input v-model="actForm.title" placeholder="请输入活动标题"/>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-date-picker v-model="actForm.time" type="datetime" placeholder="选择时间" style="width:100%" />
                  </el-form-item>
                  <el-form-item label="人员">
                    <el-input v-model="actForm.people" placeholder="参与人员姓名或人数" />
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input type="textarea" v-model="actForm.desc" :rows="3" placeholder="请输入活动描述"/>
                  </el-form-item>
                  <el-form-item label="照片">
                    <div v-if="actForm.imagePreview" class="photo-preview">
                      <el-image :src="actForm.imagePreview" class="photo-preview-img" fit="cover"/>
                      <p class="small muted photo-path-hint">建议路径：{{ actForm.suggestedPath }}</p>
                    </div>
                    <div class="photo-upload">
                      <input type="file" accept="image/*" @change="onActivityFileChange" class="photo-file-input" ref="activityFileInput" multiple/>
                      <el-button size="small" @click="triggerActivityFileInput">选择文件（可多选）</el-button>
                    </div>
                    <el-input 
                      v-model="actForm.photos" 
                      type="textarea"
                      :rows="2"
                      placeholder="照片路径，如：/images/activities/H1.jpg（多个用逗号分隔）"
                      class="photo-path-input"
                    />
                    <p class="small muted photo-tip">图片会上传到服务器并自动写入图片地址</p>
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitActivity">{{ actFormMode === 'edit' ? '保存' : '添加' }}</el-button>
                    <el-button v-if="actFormMode === 'edit'" @click="cancelEditActivity">取消</el-button>
                  </div>
                </el-form>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 人员管理 -->
      <el-tab-pane label="👥 人员管理">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :md="14" :lg="14">
            <div class="people-list-section">
              <h3>人员列表</h3>
              <div class="people-card-grid">
                <el-card v-for="p in people" :key="p.id" class="people-card">
                  <div v-if="p.photos && p.photos.length" class="people-card-photo">
                    <el-image v-for="(photo, i) in p.photos" :key="i" :src="photo" class="people-photo-img" fit="cover"/>
                  </div>
                  <div class="people-card-content">
                    <h4 class="people-card-name">{{ p.name }}</h4>
                    <p class="small muted" v-if="p.personality">性格：{{ p.personality }}</p>
                    <p class="small muted" v-if="p.skills">技能：{{ p.skills }}</p>
                    <p class="small muted" v-if="p.contact">联系方式：{{ p.contact }}</p>
                    <div class="people-card-actions">
                      <el-button type="primary" size="small" @click="editPerson(p)">编辑</el-button>
                      <el-button type="danger" size="small" @click="deletePer(p.id)">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10">
            <div class="people-form-section">
              <h3>{{ perFormMode === 'edit' ? '✏️ 编辑人员' : '➕ 添加新人员' }}</h3>
              <el-card class="people-form-card">
                <el-form label-position="top" :model="perForm" class="people-form">
                  <el-form-item label="姓名">
                    <el-input v-model="perForm.name" placeholder="请输入姓名"/>
                  </el-form-item>
                  <el-form-item label="性格">
                    <el-input v-model="perForm.personality" type="textarea" :rows="2" placeholder="请输入性格描述"/>
                  </el-form-item>
                  <el-form-item label="技能">
                    <el-input v-model="perForm.skills" placeholder="请输入技能"/>
                  </el-form-item>
                  <el-form-item label="联系方式">
                    <el-input v-model="perForm.contact" placeholder="请输入联系方式"/>
                  </el-form-item>
                  <el-form-item label="照片">
                    <div v-if="perForm.imagePreview" class="photo-preview">
                      <el-image :src="perForm.imagePreview" class="photo-preview-img" fit="cover"/>
                      <p class="small muted photo-path-hint">建议路径：{{ perForm.suggestedPath }}</p>
                    </div>
                    <div class="photo-upload">
                      <input type="file" accept="image/*" @change="onPersonFileChange" class="photo-file-input" ref="personFileInput"/>
                      <el-button size="small" @click="triggerPersonFileInput">选择文件</el-button>
                    </div>
                    <el-input 
                      v-model="perForm.photos" 
                      placeholder="照片路径，如：/images/person/person1.jpg（多个用逗号分隔）"
                      class="photo-path-input"
                    />
                    <p class="small muted photo-tip">图片会上传到服务器并自动写入图片地址</p>
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitPerson">{{ perFormMode === 'edit' ? '保存' : '添加' }}</el-button>
                    <el-button v-if="perFormMode === 'edit'" @click="cancelEditPerson">取消</el-button>
                  </div>
                </el-form>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 活动物品管理 -->
      <el-tab-pane label="🎁 活动物品管理">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="24" :md="14" :lg="14">
            <div class="items-list-section">
              <h3>物品列表</h3>
              <div class="items-card-grid">
                <el-card v-for="it in items" :key="it.id" class="items-card">
                  <div v-if="it.image" class="items-card-photo">
                    <el-image :src="it.image" class="items-photo-img" fit="cover"/>
                  </div>
                  <div class="items-card-content">
                    <h4 class="items-card-name">{{ it.name }}</h4>
                    <p class="small muted" v-if="it.time">时间：{{ it.time }}</p>
                    <p v-if="it.description" class="items-desc">{{ it.description }}</p>
                    <div class="items-card-actions">
                      <el-button type="primary" size="small" @click="editItem(it)">编辑</el-button>
                      <el-button type="danger" size="small" @click="deleteItem(it.id)">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10">
            <div class="items-form-section">
              <h3>{{ itemFormMode === 'edit' ? '✏️ 编辑物品' : '➕ 添加新物品' }}</h3>
              <el-card class="items-form-card">
                <el-form label-position="top" :model="itemForm" class="items-form">
                  <el-form-item label="名称">
                    <el-input v-model="itemForm.name" placeholder="请输入物品名称"/>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-date-picker v-model="itemForm.time" type="date" placeholder="选择时间" style="width:100%" />
                  </el-form-item>
                  <el-form-item label="描述">
                    <el-input type="textarea" v-model="itemForm.description" :rows="3" placeholder="请输入物品描述"/>
                  </el-form-item>
                  <el-form-item label="照片">
                    <div v-if="itemForm.imagePreview" class="photo-preview">
                      <el-image :src="itemForm.imagePreview" class="photo-preview-img" fit="cover"/>
                      <p class="small muted photo-path-hint">建议路径：{{ itemForm.suggestedPath }}</p>
                    </div>
                    <div class="photo-upload">
                      <input type="file" accept="image/*" @change="onItemFileChange" class="photo-file-input" ref="itemFileInput"/>
                      <el-button size="small" @click="triggerItemFileInput">选择文件</el-button>
                    </div>
                    <el-input 
                      v-model="itemForm.image" 
                      placeholder="照片路径，如：/images/item/item1.jpg"
                      class="photo-path-input"
                    />
                    <p class="small muted photo-tip">图片会上传到服务器并自动写入图片地址</p>
                  </el-form-item>
                  <div class="form-actions">
                    <el-button type="primary" @click="submitItem">{{ itemFormMode === 'edit' ? '保存' : '添加' }}</el-button>
                    <el-button v-if="itemFormMode === 'edit'" @click="cancelEditItem">取消</el-button>
                  </div>
                </el-form>
              </el-card>
            </div>
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
      items: [],
      actForm: {title:'',time:'',people:'',desc:'',photos:'',imagePreview:'',suggestedPath:''},
      actFormMode: 'add', // 'add' | 'edit'
      editingActivityId: null,
      perForm: {name:'',personality:'',skills:'',contact:'',photos:'',imagePreview:'',suggestedPath:''},
      perFormMode: 'add', // 'add' | 'edit'
      editingPersonId: null,
      itemForm: {name:'',time:'',description:'',image:'',imagePreview:'',suggestedPath:''},
      itemFormMode: 'add', // 'add' | 'edit'
      editingItemId: null
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
      this.items = await api.getItems()
    },
    triggerActivityFileInput() {
      this.$refs.activityFileInput?.click()
    },
    triggerPersonFileInput() {
      this.$refs.personFileInput?.click()
    },
    async onActivityFileChange(e) {
      const files = e.target.files
      if(!files || files.length === 0) return
      const fileArray = Array.from(files)
      const uploadResults = await Promise.all(fileArray.map((file) => api.uploadImage(file)))
      const paths = uploadResults.map((result) => result.path)
      this.actForm.imagePreview = paths[0] || ''
      this.actForm.suggestedPath = paths.join(', ')
      if (!this.actForm.photos) {
        this.actForm.photos = paths.join(',')
      } else {
        const existingPaths = this.actForm.photos.split(',').map((s) => s.trim()).filter((s) => s)
        this.actForm.photos = [...existingPaths, ...paths].join(',')
      }
      this.$message.success('活动图片上传成功')
    },
    editActivity(activity) {
      this.actFormMode = 'edit'
      this.editingActivityId = activity.id
      this.actForm = {
        title: activity.title || '',
        time: activity.time || '',
        people: activity.people || '',
        desc: activity.desc || '',
        photos: activity.photos ? activity.photos.join(',') : '',
        imagePreview: activity.photos && activity.photos.length ? activity.photos[0] : '',
        suggestedPath: activity.photos && activity.photos.length ? activity.photos[0] : ''
      }
      // 滚动到表单
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEditActivity() {
      this.clearActivityForm()
    },
    clearActivityForm() {
      this.actForm = {title:'',time:'',people:'',desc:'',photos:'',imagePreview:'',suggestedPath:''}
      this.actFormMode = 'add'
      this.editingActivityId = null
      // 清空文件输入
      if (this.$refs.activityFileInput) {
        this.$refs.activityFileInput.value = ''
      }
    },
    async submitActivity() {
      if (!this.actForm.title) {
        this.$message.warning('请输入活动标题')
        return
      }
      const payload = {
        title: this.actForm.title,
        time: (this.actForm.time && new Date(this.actForm.time).toLocaleString()) || new Date().toLocaleString(),
        people: this.actForm.people,
        desc: this.actForm.desc,
        photos: this.actForm.photos ? this.actForm.photos.split(',').map(s => s.trim()).filter(s => s) : []
      }
      
      if (this.actFormMode === 'edit') {
        payload.id = this.editingActivityId
        await api.updateActivity(payload)
        this.$message.success('活动信息已更新')
      } else {
        await api.addActivity(payload)
        this.$message.success('活动添加成功')
      }
      
      this.activities = await api.getActivities()
      this.clearActivityForm()
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
    async onPersonFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if(!file) return
      const result = await api.uploadImage(file)
      this.perForm.imagePreview = result.path
      this.perForm.suggestedPath = result.path
      if (!this.perForm.photos) {
        this.perForm.photos = result.path
      } else {
        const existingPaths = this.perForm.photos.split(',').map((s) => s.trim()).filter((s) => s)
        this.perForm.photos = [...existingPaths, result.path].join(',')
      }
      this.$message.success('人员图片上传成功')
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
      if (this.$refs.personFileInput) {
        this.$refs.personFileInput.value = ''
      }
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
    triggerItemFileInput() {
      this.$refs.itemFileInput?.click()
    },
    async onItemFileChange(e) {
      const file = e.target.files && e.target.files[0]
      if(!file) return
      const result = await api.uploadImage(file)
      this.itemForm.imagePreview = result.path
      this.itemForm.suggestedPath = result.path
      if (!this.itemForm.image) {
        this.itemForm.image = result.path
      }
      this.$message.success('物品图片上传成功')
    },
    editItem(item) {
      this.itemFormMode = 'edit'
      this.editingItemId = item.id
      this.itemForm = {
        name: item.name || '',
        time: item.time || '',
        description: item.description || '',
        image: item.image || '',
        imagePreview: item.image || '',
        suggestedPath: item.image || ''
      }
      // 滚动到表单
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEditItem() {
      this.clearItemForm()
    },
    clearItemForm() {
      this.itemForm = {name:'',time:'',description:'',image:'',imagePreview:'',suggestedPath:''}
      this.itemFormMode = 'add'
      this.editingItemId = null
      // 清空文件输入
      if (this.$refs.itemFileInput) {
        this.$refs.itemFileInput.value = ''
      }
    },
    async submitItem() {
      if (!this.itemForm.name) {
        this.$message.warning('请输入物品名称')
        return
      }
      const payload = {
        name: this.itemForm.name,
        time: this.itemForm.time ? new Date(this.itemForm.time).toLocaleDateString() : '',
        description: this.itemForm.description || '',
        image: this.itemForm.image || ''
      }
      
      if (this.itemFormMode === 'edit') {
        payload.id = this.editingItemId
        await api.updateItem(payload)
        this.$message.success('物品信息已更新')
      } else {
        await api.addItem(payload)
        this.$message.success('物品添加成功')
      }
      
      this.items = await api.getItems()
      this.clearItemForm()
    },
    async deleteItem(id) {
      this.$confirm('确认删除此物品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deleteItem(id)
        this.items = await api.getItems()
        this.$message.success('物品已删除')
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
  margin-bottom: 20px;
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

/* 人员管理部分样式 */
.people-list-section {
  margin-bottom: 20px;
}

.people-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.people-card {
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.people-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.people-card-photo {
  margin-bottom: 12px;
}

.people-photo-img {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  display: block;
}

.people-card-content {
  padding: 0 4px;
}

.people-card-name {
  color: var(--accent);
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.people-card-content .small {
  margin: 6px 0;
  line-height: 1.5;
}

.people-card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.people-form-section {
  position: sticky;
  top: 20px;
}

.people-form-card {
  border-radius: 12px;
  padding: 20px;
}

.people-form {
  margin-top: 10px;
}

.people-form .el-form-item {
  margin-bottom: 20px;
}

.people-form .el-form-item__label {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--accent);
}

.photo-preview {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.photo-preview-img {
  width: 100%;
  max-width: 200px;
  height: 150px;
  border-radius: 8px;
  display: block;
  margin: 0 auto 8px;
}

.photo-path-hint {
  margin-top: 8px;
  word-break: break-all;
  color: var(--muted);
}

.photo-upload {
  margin-bottom: 12px;
}

.photo-file-input {
  display: none;
}

.photo-upload-label {
  display: inline-block;
  cursor: pointer;
}

.photo-path-input {
  margin-bottom: 8px;
}

.photo-tip {
  margin-top: 8px;
  line-height: 1.5;
  color: var(--muted);
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.form-actions .el-button {
  flex: 1;
}

/* 活动管理表单样式 */
.activity-form-section {
  position: sticky;
  top: 20px;
}

.activity-form-card {
  border-radius: 12px;
  padding: 20px;
}

.activity-form {
  margin-top: 10px;
}

.activity-form .el-form-item {
  margin-bottom: 20px;
}

.activity-form .el-form-item__label {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--accent);
}

/* 活动列表样式 */
.activity-list-section {
  margin-bottom: 20px;
}

.activity-timeline {
  padding-left: 20px;
}

.activity-item {
  margin-bottom: 20px;
}

.activity-card {
  border-radius: 12px;
  padding: 16px;
  transition: box-shadow 0.3s;
}

.activity-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-title {
  color: var(--accent);
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.activity-desc {
  margin: 8px 0;
  line-height: 1.6;
  color: var(--muted);
}

.activity-photos {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.activity-photo-thumb {
  width: 120px;
  height: 90px;
  border-radius: 8px;
}

.activity-actions {
  display: flex;
  gap: 8px;
}

/* 活动物品管理样式 */
.items-list-section {
  margin-bottom: 20px;
}

.items-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.items-card {
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.items-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.items-card-photo {
  margin-bottom: 12px;
}

.items-photo-img {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  display: block;
}

.items-card-content {
  padding: 0 4px;
}

.items-card-name {
  color: var(--accent);
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.items-card-content .small {
  margin: 6px 0;
  line-height: 1.5;
}

.items-desc {
  margin: 8px 0;
  line-height: 1.6;
  color: var(--muted);
}

.items-card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.items-form-section {
  position: sticky;
  top: 20px;
}

.items-form-card {
  border-radius: 12px;
  padding: 20px;
}

.items-form {
  margin-top: 10px;
}

.items-form .el-form-item {
  margin-bottom: 20px;
}

.items-form .el-form-item__label {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--accent);
}
</style>
