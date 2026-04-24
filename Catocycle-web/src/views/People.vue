<template>
  <div>
    <div class="people-container">
      <h3 class="people-title">👥 人员介绍</h3>

      <div class="people-wave">
        <div
          v-for="(p, index) in people"
          :key="p.id"
          class="person-row"
        >
          <el-card class="person-card">
            <div class="person-card-inner">
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
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data(){
    return {
      people: []
    }
  },
  async created(){
    this.people = await api.getPeople()
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
  border-radius: 16px;
  border: 1px solid #e2c3a5;
  background-color: #fff9f3;
  box-shadow: 0 10px 20px rgba(113, 76, 48, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.person-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 24px rgba(113, 76, 48, 0.16);
}

.person-card-inner {
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.person-photo {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e9d7c6;
}

@media (max-width: 860px) {
  .person-card-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
