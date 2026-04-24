# 猫驼旅者客栈前端项目

基于 `Vue 3 + Vite + Element Plus` 的展示与管理系统，包含主页、活动记录、活动详情、人员介绍、物品展示、管理员登录和管理后台。

当前版本已完成服务层重构：在不改变页面功能的前提下，将原先集中在 `api.js` 的逻辑拆分为 `modules + mock + facade`，便于后续无缝切换到真实后端接口。

## 技术栈

- `Vue 3`
- `Vue Router 4`
- `Element Plus`
- `Axios`（已预留，当前 mock 模式）
- `Vite 5`

## 功能清单

- 主页展示与导航
- 活动记录列表与详情页
- 人员列表展示
- 物品列表展示
- 管理员登录（账号/密码/验证码）
- 后台活动、人员、物品的增删改

## 架构说明（简洁版）

### 1) 页面层

- `src/views`：只负责页面展示与用户交互
- `src/router`：路由配置与页面跳转

### 2) 服务层（本次重构重点）

- `src/services/api.js`：统一门面（兼容旧调用方式）
- `src/services/auth.js`：认证门面（兼容旧调用方式）
- `src/services/modules/*.service.js`：按业务域拆分（activities / people / items）
- `src/services/mock/*`：本地存储读写与默认种子数据
- `src/services/http.js`：统一 HTTP 客户端（为未来真实后端预留）

### 3) 数据模式

- 现阶段：`localStorage` 模拟接口
- 未来迁移：只需把 `modules/*.service.js` 的内部实现从 mock 换成 `http` 请求，页面可不改

## 目录结构

```text
Catocycle-web/
├─ public/
│  └─ images/
├─ src/
│  ├─ router/
│  │  └─ index.js
│  ├─ services/
│  │  ├─ api.js
│  │  ├─ auth.js
│  │  ├─ auth.service.js
│  │  ├─ http.js
│  │  ├─ index.js
│  │  ├─ modules/
│  │  │  ├─ activities.service.js
│  │  │  ├─ people.service.js
│  │  │  └─ items.service.js
│  │  └─ mock/
│  │     ├─ seeds.js
│  │     └─ storage.js
│  ├─ views/
│  ├─ App.vue
│  ├─ main.js
│  └─ style.css
├─ .env
├─ .env.production
├─ vite.config.js
└─ package.json
```

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm install
npm run build
```

构建产物在 `dist` 目录。

## Linux 部署（无 Docker）

### 1) 前端发布

- 将 `dist` 上传到服务器站点目录，例如 `/var/www/catocycle-web/dist`
- 使用 `Nginx` 托管静态文件

### 2) Nginx 配置要点（SPA 路由回退）

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /var/www/catocycle-web/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 3) 如果未来接入后端 API

- 前端配置：`VITE_API_BASE=/api`
- Nginx 追加反向代理：

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3000/;
}
```

## 后续重构建议

- 新增 `Pinia` 做状态管理（管理员态、列表缓存）
- 用真实后端替换 mock（优先改 `modules` 层）
- 补充表单校验与异常提示统一处理
