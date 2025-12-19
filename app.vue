<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">🌤️ 天气查询站</h1>

      <!-- 城市输入表单 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form @submit.prevent="searchWeather" class="flex flex-col md:flex-row gap-4">
          <input
            v-model="city"
            type="text"
            placeholder="请输入城市名称（如：Beijing, Shanghai, London）"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? '查询中...' : '查询天气' }}
          </button>
        </form>
      </div>

      <!-- 错误提示 -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700"
      >
        {{ error }}
      </div>

      <!-- 当前天气 -->
      <div
        v-if="weatherData"
        class="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ weatherData.city }}, {{ weatherData.country }}
        </h2>
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center gap-6 mb-6 md:mb-0">
            <span class="text-8xl">{{ weatherData.current.weather.icon }}</span>
            <div>
              <div class="text-5xl font-bold text-gray-800">
                {{ weatherData.current.temperature }}°C
              </div>
              <div class="text-xl text-gray-600 mt-2">
                {{ weatherData.current.weather.description }}
              </div>
              <div class="text-lg text-gray-500 mt-1">
                体感温度: {{ weatherData.current.feelsLike }}°C
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-500">湿度</div>
              <div class="text-2xl font-bold text-gray-800">{{ weatherData.current.humidity }}%</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-500">风速</div>
              <div class="text-2xl font-bold text-gray-800">{{ weatherData.current.windSpeed }} m/s</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7 天预报 -->
      <div
        v-if="weatherData?.forecast"
        class="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-6">7 天预报</h2>
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div
            v-for="(day, index) in weatherData.forecast"
            :key="index"
            class="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
          >
            <div class="font-semibold text-gray-800 mb-2">
              {{ formatDate(day.date) }}
            </div>
            <span class="text-4xl mb-2 block">{{ day.weather.icon }}</span>
            <div class="text-sm text-gray-600 mb-1">
              {{ day.weather.description }}
            </div>
            <div class="text-sm font-bold text-gray-800">
              {{ day.maxTemp }}° / {{ day.minTemp }}°
            </div>
            <div class="text-xs text-gray-500 mt-1">
              湿度: {{ day.humidity }}%
            </div>
            <div class="text-xs text-gray-500">
              风速: {{ day.windSpeed }} m/s
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const city = ref('')
const loading = ref(false)
const error = ref('')
const weatherData = ref(null)

const searchWeather = async () => {
  if (!city.value.trim()) {
    error.value = '请输入城市名称'
    return
  }

  loading.value = true
  error.value = ''
  weatherData.value = null

  try {
    weatherData.value = await $fetch('/api/forecast?city=' + encodeURIComponent(city.value))
  } catch (err) {
    // 处理错误信息，提供更友好的用户提示
    if (err && err.data && err.data.message) {
      error.value = err.data.message
    } else if (err && err.message) {
      error.value = err.message
    } else {
      error.value = '获取天气数据失败，请检查城市名称是否正确'
    }
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { month: 'short', day: 'numeric', weekday: 'short' }
  return date.toLocaleDateString('zh-CN', options)
}
</script>