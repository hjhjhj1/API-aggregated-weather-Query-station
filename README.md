# 天气查询站

一个基于 Nuxt 3 的 API 聚合天气查询站，集成多个天气数据源，提供准确的当前天气和预报信息。

## 功能特性

- 🌤️ **实时天气查询**：输入城市名称即可获取当前天气信息
- 📅 **7 天天气预报**：提供未来一周的详细天气预测
- 📊 **空气质量指数**：显示空气质量相关信息
- 🎨 **现代化 UI**：使用 Tailwind CSS 打造美观的用户界面
- ⚡ **SSR 支持**：基于 Nuxt 3 的服务端渲染，提供更快的首屏加载

## 技术栈

- **框架**: Nuxt 3.9
- **样式**: Tailwind CSS
- **API 调用**: $fetch
- **天气数据**: Open-Meteo API（无需 API Key）

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## API 接口

### /api/weather

获取指定城市的当前天气信息

**参数**:
- `city`: 城市名称

**返回**:
- 当前温度、湿度、风速等信息

### /api/forecast

获取指定城市的当前天气和 7 天预报

**参数**:
- `city`: 城市名称

**返回**:
- 当前天气信息
- 未来 7 天的天气预报

## 使用说明

1. 在首页输入框中输入城市名称（支持中英文，如 "Beijing" 或 "上海"）
2. 点击 "查询天气" 按钮
3. 查看当前天气信息和未来 7 天的预报

## 错误处理

- 城市不存在时显示友好提示
- 网络错误时提供重试建议
- 输入为空时提示用户输入城市名称

## 项目结构

```
.
├── app.vue                    # 主应用组件
├── nuxt.config.ts             # Nuxt 配置
├── tailwind.config.js         # Tailwind CSS 配置
├── package.json               # 项目依赖
└── server/
    └── api/
        ├── weather.ts         # 天气 API 接口
        └── forecast.ts        # 预报 API 接口
```

## 许可证

MIT