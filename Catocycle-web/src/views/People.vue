<template>
  <div>
    <div class="people-container">
      <h3 class="people-title">👥 人员介绍</h3>

        <!-- 普通访客：波浪形左右交错展示 -->
        <div v-if="!isAdmin" class="people-wave">
          <div
            v-for="(p, index) in people"
            :key="p.id"
            class="person-row"
          >
            <el-card class="person-card">
              <div class="person-info">
                <h4>{{ p.name }}</h4>
                <p class="small muted">简介：{{ p.personality }}</p>
                <p class="small muted">联系方式：{{ p.contact }}</p>
              </div>
              <div v-if="p.photos && p.photos.length" class="person-photo-wrap">
                <el-image
                  v-for="(photo, i) in p.photos"
                  :key="i"
                  :src="photo"
                  class="person-photo"
                  fit="cover"
                />
              </div>
            </el-card>
          </div>
        </div>

        <!-- 管理员：仍然使用网格方便管理 -->
        <div v-else class="people-wave">
          <div
            v-for="p in people"
            :key="p.id"
            class="person-row"
          >
            <el-card class="person-card">
              <div class="person-info">
                <h4>{{ p.name }}</h4>
                <p class="small muted">简介：{{ p.personality }}</p>
                <p class="small muted">联系方式：{{ p.contact }}</p>
                <div style="margin-top:10px">
                  <el-button type="danger" size="small" @click="deletePer(p.id)">删除</el-button>
                </div>
              </div>
              <div v-if="p.photos && p.photos.length" class="person-photo-wrap">
                <el-image
                  v-for="(photo, i) in p.photos"
                  :key="i"
                  :src="photo"
                  class="person-photo"
                  fit="cover"
                />
              </div>
            </el-card>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import auth from '../services/auth'

export default {
  data(){
    return {
      people: [],
      isAdmin: false
    }
  },
  async created(){
    this.isAdmin = auth.isAdmin()
    this.people = await api.getPeople()
  },
  methods:{
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

<style scoped>
.people-container {
  max-width: 900px;
  margin: 0 auto;
}

.people-title {
  text-align: center;
  margin-bottom: 16px;
}

.people-wave {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.person-row {
  width: 100%;
}

.person-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
}

.person-info {
  flex: 1;
}

.person-photo-wrap {
  flex-shrink: 0;
}

.person-photo {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transform: rotate(270deg);
}
</style>
