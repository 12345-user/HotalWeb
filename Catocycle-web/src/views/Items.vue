<template>
  <div>
    <el-row>
      <el-col :span="14">
        <h3>🎁 活动物品展示</h3>
        <div class="card-grid">
          <el-card v-for="it in items" :key="it.id" style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div style="flex:1">
                <h4>{{ it.name }}</h4>
                <p class="small muted">时间：{{ it.time }}</p>
                <p>{{ it.description }}</p>
                <div v-if="it.image" style="margin-top:8px">
                  <el-image :src="it.image" style="width:160px;height:120px" fit="cover"/>
                </div>
              </div>
              <div style="margin-left:12px;text-align:right">
                <el-button size="mini" type="primary" @click="viewItem(it)">查看</el-button>
                <el-button v-if="isAdmin" size="mini" @click="onEdit(it)">编辑</el-button>
                <el-button v-if="isAdmin" size="mini" type="danger" @click="onDelete(it.id)">删除</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="10">
        <h3 v-if="isAdmin">{{ formMode === 'add' ? '➕ 添加新物品' : '✏️ 编辑物品' }}</h3>
        <h3 v-else>物品详情（只读）</h3>

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
            <el-button v-if="!isAdmin" @click="clearForm">清除</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" width="520px">
      <span slot="title">物品详情</span>
      <div>
        <h4>{{ detailItem.name }}</h4>
        <p class="small muted">时间：{{ detailItem.time }}</p>
        <p>{{ detailItem.description }}</p>
        <div v-if="detailItem.image" style="margin-top:8px">
          <el-image :src="detailItem.image" style="width:100%" fit="contain"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">关闭</el-button>
      </span>
    </el-dialog>
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
      form:{name:'',time:'',description:'',image:'',imagePreview:''},
      dialogVisible:false,
      detailItem:{}
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
    },
    viewItem(it){
      this.detailItem = it
      this.dialogVisible = true
    }
  }
}
</script>
