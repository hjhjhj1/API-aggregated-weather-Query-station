export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-12-24',
  modules: [],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})