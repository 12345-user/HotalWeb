# 猫驼旅者客栈项目（前后端分离）

项目已升级为前后端分离架构：

- 前端：`Catocycle-web`（Vue 3 + Vite + Element Plus）
- 后端：`catocycle-api`（Express + MySQL + Multer）

已实现：

- 页面视觉质感升级（全局配色、卡片层次、交互 hover）
- 活动/人员/物品数据持久化到 MySQL
- 图片上传到后端并通过 `/uploads/*` 访问
- 前端管理页上传后自动回填图片地址，数据直接入库

## 技术栈（当前）

- `Vue 3`
- `Vue Router 4`
- `Element Plus`
- `Axios`
- `Vite 5`
- `Express`
- `MySQL 8`
- `Multer`（图片上传）

## 功能清单

- 主页展示与导航
- 活动记录列表与详情页
- 人员列表展示
- 物品列表展示
- 管理员登录（账号/密码/验证码）
- 后台活动、人员、物品的增删改

## 架构说明（简洁）

- `Catocycle-web/src/views`：页面与交互
- `Catocycle-web/src/services/http.js`：统一 HTTP 客户端（`/api`）
- `Catocycle-web/src/services/modules/*.service.js`：业务接口层
- `catocycle-api/src/server.js`：REST API + 上传接口
- `catocycle-api/src/db.js`：MySQL 连接和建表
- `catocycle-api/src/seed.js`：空库自动写入初始示例数据

## 目录结构

```text
WebForHostel/
├─ Catocycle-web/          # 前端
│  ├─ src/
│  │  ├─ views/
│  │  ├─ services/
│  │  │  ├─ http.js
│  │  │  ├─ api.js
│  │  │  └─ modules/
│  │  └─ style.css
│  └─ vite.config.js
└─ catocycle-api/          # 后端
   ├─ src/
   │  ├─ server.js
   │  ├─ db.js
   │  └─ seed.js
   └─ .env.example
```

## 本地运行（开发）

### 1) 启动后端

```bash
cd catocycle-api
cp .env.example .env
# 编辑 .env 填写 MySQL 账号密码
npm install
npm run dev
```

### 2) 启动前端

```bash
cd Catocycle-web
npm install
npm run dev
```

默认访问：`http://localhost:5173`

## 数据库说明（MySQL）

- 后端启动会自动创建数据库和数据表：
  - `activities`
  - `people`
  - `items`
- 首次空库启动会自动写入示例数据
- 所有管理后台新增/编辑/删除都会直接写入数据库
- 上传图片保存在 `catocycle-api/uploads`，并返回可访问 URL

## 生产构建与部署（Linux，无 Docker）

### 1) 构建前端

```bash
cd Catocycle-web
npm ci
npm run build
```

将 `dist` 发布到：`/var/www/catocycle-web/dist`

### 2) 启动后端（PM2）

```bash
cd catocycle-api
npm ci
cp .env.example .env
# 修改 .env
pm2 start src/server.js --name catocycle-api
pm2 save
```

### 3) Nginx 反向代理（前端 + API + 上传）

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /var/www/catocycle-web/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
  }

  location /uploads/ {
    proxy_pass http://127.0.0.1:3000/uploads/;
  }
}
```
