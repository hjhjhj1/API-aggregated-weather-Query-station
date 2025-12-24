export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  compatibilityDate: '2025-12-24',
  tailwindcss: {
    config: './tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css',
  },
  vite: {
    css: {
      postcss: './postcss.config.js'
    }
  },
  postcss: {
    plugins: {
      'tailwindcss': {},
      'autoprefixer': {}
    }
  }
})