# 图片存放说明

## 文件夹结构

- `carousel/` - 轮播图图片（主页展示）
  - 建议放入 3 张图片，命名为 `carousel-1.jpg`, `carousel-2.jpg`, `carousel-3.jpg`
  - 或任意名称，但在 `src/views/Home.vue` 中的 `images` 数组里更新对应路径

- `activities/` - 活动记录图片
  - 在活动记录表单中上传照片时，使用相对路径 `/images/activities/` + 图片名称
  - 例如：`/images/activities/event-photo-1.jpg`

## 使用方式

1. 把你的图片文件放入对应文件夹
2. 在代码或表单中使用路径：`/images/carousel/carousel-1.jpg` 等
3. 构建后（`npm run build`），这些图片会自动复制到 `dist/images/` 下

## 支持的格式

- JPG / JPEG
- PNG
- WebP
- GIF 等常见格式
