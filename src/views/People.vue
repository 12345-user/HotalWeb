<template>
  <div>
    <el-row>
      <el-col :span="16">
        <h3>👥 人员介绍</h3>
        <div class="card-grid">
          <el-card v-for="p in people" :key="p.id">
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
        <el-form label-position="top" :model="form">
          <el-form-item label="姓名"><el-input v-model="form.name"/></el-form-item>
          <el-form-item label="性格"><el-input v-model="form.personality"/></el-form-item>
          <el-form-item label="技能"><el-input v-model="form.skills"/></el-form-item>
          <el-form-item label="联系方式"><el-input v-model="form.contact"/></el-form-item>
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
    return {
      people: [],
      form: {name:'',personality:'',skills:'',contact:''}
    }
  },
  async created(){
    this.people = await api.getPeople()
  },
  methods:{
    async submit(){
      await api.addPerson({...this.form})
      this.people = await api.getPeople()
      this.form = {name:'',personality:'',skills:'',contact:''}
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
