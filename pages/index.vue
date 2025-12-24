<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">API 聚合天气查询站</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="city"
            type="text"
            placeholder="输入城市名称..."
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="searchWeather"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            查询天气
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600">正在获取天气数据...</p>
      </div>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
        {{ error }}
      </div>
      
      <div v-if="weatherData" class="space-y-8">
        <!-- 当前天气 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">当前天气</h2>
          <div class="flex flex-col md:flex-row items-center gap-8">
            <div class="text-center">
              <img
                :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
                alt="天气图标"
                class="w-24 h-24 mx-auto mb-2"
              />
              <p class="text-xl font-bold text-gray-800">{{ weatherData.current.weather[0].main }}</p>
              <p class="text-gray-600">{{ weatherData.current.weather[0].description }}</p>
            </div>
            <div class="text-center">
              <p class="text-5xl font-bold text-gray-800">{{ weatherData.current.main.temp }}°C</p>
              <p class="text-gray-600 mb-2">体感温度: {{ weatherData.current.main.feels_like }}°C</p>
            </div>
          </div>
        </div>
        
        <!-- 7 天预报 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">7 天预报</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div
              v-for="(day, index) in weatherData.forecast"
              :key="index"
              class="bg-gray-50 rounded-lg p-4 text-center"
            >
              <p class="text-sm font-medium text-gray-600 mb-2">{{ formatDate(day.dt_txt) }}</p>
              <img
                :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                alt="天气图标"
                class="w-12 h-12 mx-auto mb-2"
              />
              <p class="text-xl font-bold text-gray-800">{{ day.main.temp }}°C</p>
              <p class="text-sm text-gray-600">{{ day.weather[0].main }}</p>
            </div>
          </div>
        </div>
        
        <!-- 详细信息 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">详细信息</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-gray-600 mb-2">湿度</p>
              <p class="text-xl font-bold text-gray-800">{{ weatherData.current.main.humidity }}%</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-gray-600 mb-2">风速</p>
              <p class="text-xl font-bold text-gray-800">{{ weatherData.current.wind.speed }} m/s</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-gray-600 mb-2">气压</p>
              <p class="text-xl font-bold text-gray-800">{{ weatherData.current.main.pressure }} hPa</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-gray-600 mb-2">能见度</p>
              <p class="text-xl font-bold text-gray-800">{{ (weatherData.current.visibility / 1000).toFixed(1) }} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const city = ref('')
const weatherData = ref<any>(null)
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
    const response = await $fetch(`/api/weather?city=${encodeURIComponent(city.value)}`)
    
    if (response.error) {
      error.value = response.error
    } else {
      weatherData.value = response
    }
  } catch (err) {
    error.value = '获取天气数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { weekday: 'short' })
}
</script>