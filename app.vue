<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-16 animate-fade-in">
        <div class="inline-flex items-center justify-center mb-4">
          <div class="bg-white/20 backdrop-blur-lg rounded-full p-4">
            <span class="text-5xl">🌤️</span>
          </div>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          天气查询站
        </h1>
        <p class="text-white/90 text-lg md:text-xl">
          聚合多个天气数据源，提供准确的天气信息
        </p>
      </header>

      <!-- Search Section -->
      <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 transform transition-all hover:shadow-3xl">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <input
            v-model="city"
            type="text"
            placeholder="请输入城市名称（如：北京、Shanghai）"
            class="flex-1 w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-300 shadow-sm hover:shadow-md"
            @keyup.enter="searchWeather"
          />
          <button
            @click="searchWeather"
            class="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
          >
            查询天气
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
        <p class="text-gray-600 text-lg">正在获取天气数据...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50/95 backdrop-blur-xl border-2 border-red-200 rounded-3xl shadow-2xl p-8 text-center mb-10"
      >
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-red-700 text-lg font-medium">{{ error }}</p>
      </div>

      <!-- Weather Data -->
      <div v-else-if="weatherData" class="space-y-10">
        <!-- Current Weather Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 transform transition-all hover:shadow-3xl">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800">
              {{ weatherData.city }}, {{ weatherData.country }}
            </h2>
            <div class="text-gray-500 text-sm">
              {{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}
            </div>
          </div>

          <div class="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div class="flex items-center gap-8">
              <div class="text-9xl md:text-10xl animate-bounce">
                {{ getWeatherIcon(weatherData.current.weatherCode) }}
              </div>
              <div>
                <div class="text-6xl md:text-7xl font-bold text-gray-800 mb-2">
                  {{ Math.round(weatherData.current.temperature) }}°C
                </div>
                <div class="text-xl text-gray-600 font-medium">
                  {{ getWeatherDescription(weatherData.current.weatherCode) }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-auto">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center transform transition-all hover:scale-105">
                <div class="text-3xl mb-2">💧</div>
                <div class="text-sm text-gray-600 font-medium mb-1">湿度</div>
                <div class="text-2xl font-bold text-gray-800">
                  {{ weatherData.current.humidity }}%
                </div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center transform transition-all hover:scale-105">
                <div class="text-3xl mb-2">💨</div>
                <div class="text-sm text-gray-600 font-medium mb-1">风速</div>
                <div class="text-2xl font-bold text-gray-800">
                  {{ weatherData.current.windSpeed }} km/h
                </div>
              </div>
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center transform transition-all hover:scale-105 md:col-span-2 lg:col-span-1">
                <div class="text-3xl mb-2">🌫️</div>
                <div class="text-sm text-gray-600 font-medium mb-1">空气质量</div>
                <div class="text-2xl font-bold text-gray-800">
                  {{ weatherData.current.airQuality ? getAQIDescription(weatherData.current.airQuality) : 'N/A' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast -->
        <div v-if="weatherData.forecast" class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          <h3 class="text-3xl font-bold text-gray-800 mb-8">7 天天气预报</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div
              v-for="(day, index) in weatherData.forecast"
              :key="index"
              class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-lg"
            >
              <div class="text-sm font-semibold text-gray-800 mb-3">
                {{ formatDate(day.date) }}
              </div>
              <div class="text-5xl mb-3">
                {{ getWeatherIcon(day.weatherCode) }}
              </div>
              <div class="text-sm text-gray-600 mb-2">
                {{ getWeatherDescription(day.weatherCode) }}
              </div>
              <div class="text-lg font-bold text-gray-800">
                {{ Math.round(day.maxTemp) }}° / {{ Math.round(day.minTemp) }}°
              </div>
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
const weatherData = ref(null)
const loading = ref(false)
const error = ref('')

const searchWeather = async () => {
  if (!city.value.trim()) {
    error.value = '请输入城市名称'
    return
  }

  loading.value = true
  error.value = ''
  weatherData.value = null

  try {
    weatherData.value = await $fetch(`/api/forecast?city=${encodeURIComponent(city.value)}`)
  } catch (err) {
    error.value = err.message || '获取天气数据失败'
  } finally {
    loading.value = false
  }
}

const getWeatherIcon = (code) => {
  // 天气代码映射（基于 Open-Meteo 的天气代码）
  const iconMap = {
    0: '☀️', // 晴天
    1: '🌤️', // 多云
    2: '⛅', // 多云
    3: '☁️', // 阴天
    45: '🌫️', // 雾
    48: '🌫️', // 雾
    51: '🌦️', // 小雨
    53: '🌦️', // 小雨
    55: '🌦️', // 小雨
    61: '🌧️', // 中雨
    63: '🌧️', // 中雨
    65: '🌧️', // 大雨
    71: '❄️', // 小雪
    73: '❄️', // 小雪
    75: '❄️', // 大雪
    77: '🌨️', // 雪
    80: '🌦️', // 阵雨
    81: '🌧️', // 阵雨
    82: '🌧️', // 暴雨
    85: '🌨️', // 阵雪
    86: '🌨️', // 阵雪
    95: '⛈️', // 雷雨
    96: '⛈️', // 雷雨
    99: '⛈️' // 雷雨
  }
  return iconMap[code] || '🌈'
}

const getWeatherDescription = (code) => {
  const descriptionMap = {
    0: '晴天',
    1: '多云',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾',
    51: '小雨',
    53: '小雨',
    55: '小雨',
    61: '中雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '小雪',
    75: '大雪',
    77: '雪',
    80: '阵雨',
    81: '阵雨',
    82: '暴雨',
    85: '阵雪',
    86: '阵雪',
    95: '雷雨',
    96: '雷雨',
    99: '雷雨'
  }
  return descriptionMap[code] || '未知天气'
}

const getAQIDescription = (aqi) => {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度污染'
  if (aqi <= 200) return '中度污染'
  if (aqi <= 300) return '重度污染'
  return '严重污染'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return '今天'
  if (date.toDateString() === tomorrow.toDateString()) return '明天'

  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
}
</script>