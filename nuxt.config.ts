export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: '天气查询站',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'API 聚合的天气查询站' }
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/output.css']
})