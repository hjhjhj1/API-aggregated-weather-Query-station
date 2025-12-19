# API-aggregated-weather-Query-station
开发“API 聚合的天气查询站”
聚合多个天气 API，展示当前天气、预报、空气质量。
技术
Nuxt 3.9 + SSR
只用 $fetch 调用第三方 API（无需 key）
样式 Tailwind CSS
功能
首页输入城市名，点击查询
server/api/weather.ts 接收城市名，
server/api/forecast.ts 返回当前天气 + 7 天预报
显示：温度、天气图标、湿度、风速
错误处理：城市不存在时显示友好提示
