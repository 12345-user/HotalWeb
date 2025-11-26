<template>
  <div>
    <section class="hero">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-carousel height="320px" indicator-position="outside">
            <el-carousel-item v-for="(img,i) in images" :key="i">
              <div style="height:320px;background-size:cover;background-position:center;border-radius:8px" :style="{backgroundImage: 'url('+img+')'}"></div>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="8">
          <div style="padding:12px">
            <h2 style="color:var(--accent)">雅宿客栈</h2>
            <p class="muted small">淡棕色调 · 温暖舒适 · 手作茶点 · 良辰好景</p>
            <el-card style="margin-top:12px">
              <p>欢迎来到雅宿。我们重视慢时光与人情味，定期举办文化与交流活动，欢迎关注活动记录。</p>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </section>

    <section style="margin-top:14px">
      <h3>特色活动</h3>
      <div class="card-grid">
        <el-card v-for="n in 3" :key="n">
          <h4>活动 {{ n }}</h4>
          <p class="small muted">主题简介 — 时间与参与人数可在活动页查看</p>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data(){
    return {
      images:[
        'https://images.unsplash.com/photo-1501117716987-c8e6b20b43f7?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1',
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2',
        'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3'
      ]
    }
  }
}
</script>
