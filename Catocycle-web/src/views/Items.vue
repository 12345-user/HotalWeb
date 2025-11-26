<template>
  <div>
    <el-row>
      <el-col :span="14">
        <h3>🎁 活动物品展示</h3>
        <div class="card-grid">
          <el-card v-for="it in items" :key="it.id">
            <h4>{{ it.title }}</h4>
            <p class="small muted">收货时间：{{ it.receivedAt }}</p>
            <p>{{ it.details }}</p>
            <div v-if="it.photos && it.photos.length">
              <el-image v-for="(p,i) in it.photos" :key="i" :src="p" style="width:120px;margin-right:8px" fit="cover"/>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="10">
        <h3>➕ 添加新物品</h3>
        <el-form label-position="top" :model="form">
          <el-form-item label="标题"><el-input v-model="form.title"/></el-form-item>
          <el-form-item label="收货时间"><el-date-picker v-model="form.receivedAt" type="date" style="width:100%"/></el-form-item>
          <el-form-item label="物品细节"><el-input v-model="form.details"/></el-form-item>
          <el-form-item label="照片 URL（逗号分隔，例如: /images/activities/item-1.jpg">
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

export default {
  data(){
    return{
      items:[],
      form:{title:'',receivedAt:'',details:'',photos:''}
    }
  },
  async created(){
    this.items = await api.getItems()
  },
  methods:{
    async submit(){
      const payload = {
        title: this.form.title,
        receivedAt: this.form.receivedAt ? new Date(this.form.receivedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        details: this.form.details,
        photos: this.form.photos ? this.form.photos.split(',').map(s=>s.trim()) : []
      }
      await api.addItem(payload)
      this.items = await api.getItems()
      this.form = {title:'',receivedAt:'',details:'',photos:''}
    }
  }
}
</script>
