# 猫驼旅者客栈前端项目 (Vue 3 + Vite + Element Plus)

这个项目是一个用于展示猫驼旅者客栈风貌、活动记录、人员介绍和物品展示的前端应用，基于 Vue 3、Vite、Element Plus，前端与后端通过 Axios 通信（本示例用 localStorage 模拟 API）。

## 快速开始

### 开发模式

```powershell
cd "F:\个人纪录web开发\Catocycle-web"
npm install
npm run dev
```

### 生产构建

```powershell
cd "F:\个人纪录web开发\Catocycle-web"
npm install
npm run build
```

构建后会生成 `dist` 文件夹，将 `dist` 上传到宝塔站点根目录（例如 `/www/wwwroot/yourdomain`）或在宝塔面板里配置站点并选择该目录即可。

## 宝塔（BT）部署注意事项

- 如果服务器没有 Node 或不想在服务器上构建：在本地运行 `npm run build`，然后把 `dist` 文件夹上传到宝塔站点根目录。
- 若在服务器上直接构建：通过宝塔终端或 SSH 进入站点目录，执行 `npm install` 和 `npm run build`（确保服务器有 Node 与 npm）。
- 单页应用路由（Vue Router）需要配置前端路由回退：
  - Nginx（宝塔 Web 服务为 Nginx）：在站点的 `配置文件` > `伪静态` 中添加如下（或通过宝塔伪静态模板）:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 功能说明

- **主页**：展示客栈轮播图、主题和简介。
- **活动记录**：添加/浏览/删除活动（时间、人员、描述、照片）。
- **人员介绍**：人员卡片，展示性格、技能和联系方式，支持删除。
- **活动物品**：记录收货时间、物品详细描述与照片。

## 项目结构

```
F:\个人纪录web开发\Catocycle-web\
├── public/
│   └── images/
│       ├── carousel/          (轮播图：p1.jpg, p2.jpg, p3.jpg)
│       └── activities/        (活动和物品照片)
├── src/
│   ├── views/                 (页面组件)
│   ├── router/                (路由配置)
│   ├── services/              (API 服务)
│   ├── App.vue                (主应用)
│   ├── main.js                (入口)
│   └── style.css              (深棕色主题)
└── package.json, vite.config.js 等配置文件
```

## 扩展建议

- 将 `src/services/api.js` 中的本地存储模拟替换为真实的后端 REST API（使用 Axios）。
- 添加图片上传后端或使用第三方存储（OSS、七牛等）。
