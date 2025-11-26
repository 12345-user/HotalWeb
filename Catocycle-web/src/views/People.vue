<template>
  <div>
    <el-row>
      <el-col :span="16">
        <h3>👥 人员介绍</h3>
        <div class="card-grid">
          <el-card v-for="p in people" :key="p.id">
            <div v-if="p.photos && p.photos.length" style="margin-bottom:12px">
              <el-image v-for="(photo, i) in p.photos" :key="i" :src="photo" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:8px" fit="cover"/>
            </div>
            <h4>{{ p.name }}</h4>
            <p class="small muted">性格：{{ p.personality }}</p>
            <p class="small muted">技能：{{ p.skills }}</p>
            <p class="small muted">联系方式：{{ p.contact }}</p>
            <div v-if="isAdmin" style="margin-top:10px">
              <el-button type="danger" size="small" @click="deletePer(p.id)">删除</el-button>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="isAdmin" :span="8">
        <h3>➕ 添加新人员</h3>
        <el-form label-position="top" :model="form">
          <el-form-item label="姓名"><el-input v-model="form.name"/></el-form-item>
          <el-form-item label="性格"><el-input v-model="form.personality"/></el-form-item>
          <el-form-item label="技能"><el-input v-model="form.skills"/></el-form-item>
          <el-form-item label="联系方式"><el-input v-model="form.contact"/></el-form-item>
          <el-form-item label="照片 URL（逗号分隔）">
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
      people: [],
      form: {name:'',personality:'',skills:'',contact:'',photos:''},
      isAdmin: false
    }
  },
  async created(){
    this.isAdmin = auth.isAdmin()
    this.people = await api.getPeople()
  },
  methods:{
    async submit(){
      const payload = {
        ...this.form,
        photos: this.form.photos ? this.form.photos.split(',').map(s => s.trim()) : []
      }
      await api.addPerson(payload)
      this.people = await api.getPeople()
      this.form = {name:'',personality:'',skills:'',contact:'',photos:''}
    },
    async deletePer(id){
      this.$confirm('确认删除此人员？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deletePerson(id)
        this.people = await api.getPeople()
        this.$message.success('人员已删除')
      }).catch(() => {})
    }
  }
}
</script>
