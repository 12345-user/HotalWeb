<template>
  <div>
    <el-row class="content-row">
      <!-- 左侧时间定位导航 -->
      <el-col :span="6" class="time-nav-col">
        <h3 class="time-nav-title">🕒 时间定位</h3>
        <ul class="time-nav-list">
          <li
            v-for="act in activities"
            :key="`nav-${act.id}`"
            class="time-nav-item"
            @click="scrollToActivity(act.id)"
          >
            <span class="time-nav-time">{{ act.time || '未设置时间' }}</span>
            <span class="time-nav-title-text">{{ act.title }}</span>
          </li>
        </ul>
      </el-col>

      <!-- 右侧活动时间线 -->
      <el-col :span="18">
        <h3>🎉 活动记录 | 猫咪同欢</h3>
        <el-timeline>
          <el-timeline-item v-for="act in activities" :key="act.id" :timestamp="act.time">
            <div class="activity-item-outer" :id="`activity-${act.id}`">
              <div class="activity-item" @click="goToActivity(act.id)">
                <div class="activity-col text">
                  <h4 class="activity-title">{{ act.title }} →</h4>
                  <p class="small muted">参与：{{ act.people }}</p>
                  <p>{{ act.desc }}</p>
                </div>
                <div class="activity-col photo" v-if="act.photos && act.photos.length">
                  <el-image
                    :src="act.photos[0]"
                    class="activity-photo-thumb"
                    fit="cover"
                  />
                </div>
                <div class="activity-col link">
                  <span class="activity-more">查看详情 →</span>
                </div>
              </div>
            </div>
            <div v-if="isAdmin" style="margin-top:8px">
              <el-button type="danger" size="small" @click.stop="deleteAct(act.id)">删除</el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
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
      activities:[],
      isAdmin: false
    }
  },
  async created(){
    this.isAdmin = auth.isAdmin()
    this.activities = await api.getActivities()
  },
  methods:{
    goToActivity(id) {
      this.$router.push(`/activity/${id}`)
    },
    scrollToActivity(id) {
      // 根据左侧时间导航跳转到右侧对应记录
      const el = this.$el.querySelector(`#activity-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    async deleteAct(id){
      this.$confirm('确认删除此活动记录？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await api.deleteActivity(id)
        this.activities = await api.getActivities()
        this.$message.success('活动已删除')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.content-row {
  justify-content: space-between;
}

.time-nav-col {
  padding-right: 18px;
  border-right: 1px solid rgba(160, 117, 74, 0.3);
}

.time-nav-title {
  color: var(--accent);
  margin-top: 0;
}

.time-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-nav-item {
  cursor: pointer;
  font-size: 13px;
  color: var(--muted);
  padding: 6px 8px;
  border-radius: 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.time-nav-item:hover {
  background-color: rgba(245, 237, 227, 0.9);
  color: var(--accent);
}

.time-nav-time {
  font-weight: 600;
  margin-right: 4px;
}

.time-nav-title-text {
  opacity: 0.85;
}

.activity-item-outer {
  padding: 6px;
  border-radius: 14px;
  border: 1px solid rgba(160, 117, 74, 0.35);
  background: linear-gradient(
    135deg,
    rgba(245, 237, 227, 0.9),
    rgba(212, 181, 160, 0.5)
  );
}

.activity-item {
  cursor: pointer;
  border: 1px solid rgba(160, 117, 74, 0.25);
  border-radius: 10px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.activity-title {
  color: var(--accent);
  margin-top: 0;
}

.activity-more {
  font-size: 12px;
  color: var(--muted);
}

.activity-col.text {
  flex: 1;
}

.activity-col.photo {
  flex-shrink: 0;
}

.activity-photo-thumb {
  width: 150px;
  height: 110px;
  border-radius: 8px;
}

.activity-col.link {
  flex-shrink: 0;
}
</style>
