<template>
  <div>
    <div>
      <h3>🎁 活动物品展示</h3>
      <div class="items-grid">
        <el-card v-for="it in items" :key="it.id" class="item-card">
          <div class="item-row">
            <div class="item-info">
              <h4>{{ it.name }}</h4>
              <p class="small muted">时间：{{ it.time }}</p>
              <p><strong>介绍：</strong>{{ it.description }}</p>
            </div>
            <div class="item-image-wrap" v-if="it.image">
              <el-image :src="it.image" class="item-image" fit="cover"/>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data(){
    return{
      items:[]
    }
  },
  async created(){
    this.items = await api.getItems() || []
  }
}
</script>

<style scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.item-card {
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 24px rgba(113, 76, 48, 0.16);
}

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
  border-radius: 10px;
  border: 1px solid #e9d7c6;
  object-fit: cover;
}
</style>
