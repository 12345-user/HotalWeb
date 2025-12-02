<template>
  <div>
    <el-row>
      <el-col :span="14">
        <h3>🎁 活动物品展示</h3>
        <div class="card-grid">
          <el-card v-for="it in items" :key="it.id" style="margin-bottom:12px">
            <div class="item-row">
              <div class="item-info">
                <h4>{{ it.name }}</h4>
                <p class="small muted">时间：{{ it.time }}</p>
                <p><strong>介绍：</strong>{{ it.description }}</p>
              </div>
              <div class="item-image-wrap" v-if="it.image">
                <el-image :src="it.image" class="item-image" fit="cover"/>
              </div>
              <div class="item-actions">
                <el-button v-if="isAdmin" size="mini" @click="onEdit(it)">编辑</el-button>
                <el-button v-if="isAdmin" size="mini" type="danger" @click="onDelete(it.id)">删除</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="isAdmin" :span="10">
        <h3>{{ formMode === 'add' ? '➕ 添加新物品' : '✏️ 编辑物品' }}</h3>

        <el-form label-position="top" :model="form">
          <el-form-item label="名称"><el-input v-model="form.name" :disabled="!isAdmin && formMode==='view'"/></el-form-item>
          <el-form-item label="时间"><el-date-picker v-model="form.time" type="date" style="width:100%" :disabled="!isAdmin && formMode==='view'"/></el-form-item>
          <el-form-item label="简介"><el-input type="textarea" v-model="form.description" :disabled="!isAdmin && formMode==='view'"/></el-form-item>
          <el-form-item label="图片">
            <div v-if="form.imagePreview">
              <el-image :src="form.imagePreview" style="width:180px;height:140px;margin-bottom:8px" fit="cover"/>
            </div>
            <input v-if="isAdmin" type="file" accept="image/*" @change="onFileChange" />
            <div v-else-if="!form.imagePreview && form.image">
              <el-image :src="form.image" style="width:180px;height:140px" fit="cover"/>
            </div>
          </el-form-item>

          <div style="margin-top:8px">
            <el-button v-if="isAdmin" type="primary" @click="submit">{{ formMode === 'add' ? '添加' : '保存' }}</el-button>
            <el-button v-if="isAdmin && formMode==='edit'" @click="cancelEdit">取消</el-button>
          </div>
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
    return{
      items:[],
      isAdmin: auth.isAdmin(),
      formMode: 'add', // add | edit | view
      editingId: null,
      form:{name:'',time:'',description:'',image:'',imagePreview:''}
    }
  },
  async created(){
    await this.loadItems()
  },
  methods:{
    async loadItems(){
      this.items = await api.getItems() || []
    },
    onFileChange(e){
      const file = e.target.files && e.target.files[0]
      if(!file) return
      const reader = new FileReader()
      reader.onload = () => {
        this.form.imagePreview = reader.result
        this.form.image = reader.result
      }
      reader.readAsDataURL(file)
    },
    async submit(){
      const payload = {
        name: this.form.name,
        time: this.form.time ? new Date(this.form.time).toLocaleDateString() : new Date().toLocaleDateString(),
        description: this.form.description,
        image: this.form.image || ''
      }

      if(this.formMode === 'add'){
        await api.addItem(payload)
      } else if(this.formMode === 'edit'){
        payload.id = this.editingId
        await api.updateItem(payload)
      }
      await this.loadItems()
      this.clearForm()
    },
    clearForm(){
      this.form = {name:'',time:'',description:'',image:'',imagePreview:''}
      this.formMode = 'add'
      this.editingId = null
    },
    onEdit(item){
      this.formMode = 'edit'
      this.editingId = item.id
      this.form.name = item.name || ''
      this.form.time = item.time || ''
      this.form.description = item.description || ''
      this.form.image = item.image || ''
      this.form.imagePreview = item.image || ''
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cancelEdit(){
      this.clearForm()
    },
    async onDelete(id){
      const ok = window.confirm('确认删除该物品吗？')
      if(!ok) return
      await api.deleteItem(id)
      await this.loadItems()
    }
  }
}
</script>

<style scoped>
.item-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.item-info {
  flex: 1;
}

.item-image-wrap {
  flex-shrink: 0;
}

.item-image {
  width: 160px;
  height: 120px;
  border-radius: 6px;
  object-fit: cover;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-left: 8px;
}
</style>
