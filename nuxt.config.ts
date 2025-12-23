export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-12-24',
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
