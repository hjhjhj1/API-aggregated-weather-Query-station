# 聚合天气查询站

一个基于Nuxt 3和Tailwind CSS的免费天气查询应用，使用Open-Meteo API获取天气数据，无需API密钥。

## 功能特性

- 🌤️ **当前天气查询**：显示当前温度、湿度、风速等信息
- 📅 **7天天气预报**：显示未来7天的温度范围和降水概率
- 🌍 **全球城市支持**：支持查询全球任意城市的天气
- 📱 **响应式设计**：适配各种屏幕尺寸
- ⚡ **实时更新**：数据实时获取，确保信息准确

## 技术栈

- **Nuxt 3**：Vue 3 框架，用于构建现代Web应用
- **Tailwind CSS**：实用优先的CSS框架，用于快速构建UI
- **Open-Meteo API**：免费的天气API，提供全球天气数据
- **OpenStreetMap Nominatim API**：免费的地理编码服务，用于获取城市坐标
- **TypeScript**：类型安全的JavaScript超集

## 安装和运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在http://localhost:3000启动（如果端口被占用，会自动使用其他端口）。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用方法

1. 在首页的输入框中输入城市名称（如"北京"、"上海"、"New York"等）
2. 点击"查询天气"按钮
3. 查看当前天气信息和7天天气预报

## API说明

### Open-Meteo API

- 接口地址：`https://api.open-meteo.com/v1/forecast`
- 功能：获取天气数据
- 特点：免费、无需API密钥、全球覆盖

### OpenStreetMap Nominatim API

- 接口地址：`https://nominatim.openstreetmap.org/search`
- 功能：根据城市名称获取坐标
- 特点：免费、无需API密钥、全球覆盖

## 项目结构

```
.
├── app/
│   └── app.vue          # 主应用组件
├── assets/
│   └── css/
│       └── main.css     # Tailwind CSS 样式文件
├── public/              # 静态资源
├── nuxt.config.ts       # Nuxt 配置文件
├── package.json         # 项目依赖配置
├── tsconfig.json        # TypeScript 配置文件
└── README.md            # 项目说明文件
```

## 注意事项

- 部分城市可能无法查询到数据，这是由于OpenStreetMap Nominatim API的数据覆盖范围限制
- 天气数据更新频率为每小时一次
- 请合理使用API，避免频繁请求

## 许可证

MIT