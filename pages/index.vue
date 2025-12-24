<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">聚合天气查询站</h1>
        <p class="text-gray-600">输入城市名，查询最新天气信息</p>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              v-model="cityName"
              type="text"
              placeholder="请输入城市名"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="searchWeather"
              :disabled="loading || !cityName"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? '查询中...' : '查询天气' }}
            </button>
          </div>

          <div v-if="error" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {{ error }}
          </div>

          <div v-if="currentWeather" class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">当前天气</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">温度</p>
                <p class="text-2xl font-bold text-blue-600">{{ currentWeather.temperature }}°C</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">湿度</p>
                <p class="text-2xl font-bold text-blue-600">{{ currentWeather.humidity }}%</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">风速</p>
                <p class="text-2xl font-bold text-blue-600">{{ currentWeather.windSpeed }} m/s</p>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">天气</p>
                <p class="text-2xl font-bold text-blue-600">{{ currentWeather.weather }}</p>
              </div>
            </div>
          </div>

          <div v-if="forecast" class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-800">7天预报</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              <div v-for="day in forecast" :key="day.date" class="bg-blue-50 p-4 rounded-lg text-center">
                <p class="text-sm text-gray-600 mb-2">{{ day.date }}</p>
                <p class="text-xl font-bold text-blue-600">{{ day.temperature }}°C</p>
                <p class="text-sm text-gray-600 mt-2">{{ day.weather }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const cityName = ref('');
const loading = ref(false);
const error = ref('');
const currentWeather = ref(null);
const forecast = ref(null);

const searchWeather = async () => {
  loading.value = true;
  error.value = '';
  currentWeather.value = null;
  forecast.value = null;

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName.value)}`);
    if (!response.ok) {
      throw new Error('查询失败');
    }
    const data = await response.json();
    currentWeather.value = data.current;
    forecast.value = data.forecast;
  } catch (err) {
    error.value = err.message || '查询失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>