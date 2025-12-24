<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
    <div class="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-8">API 聚合的天气查询站</h1>
      <div class="flex gap-4 mb-8">
        <input
          v-model="city"
          type="text"
          placeholder="输入城市名（如：北京）"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="queryWeather"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          查询
        </button>
      </div>
      <div v-if="error" class="text-red-500 text-center mb-4">{{ error }}</div>
      <div v-if="currentWeather" class="mb-8">
        <div class="flex items-center justify-center mb-4">
          <img :src="currentWeather.icon" alt="天气图标" class="w-24 h-24 mb-4" />
          <div class="text-6xl font-bold text-blue-600 ml-4">{{ currentWeather.temperature }}°C</div>
        </div>
        <div class="text-2xl text-center mb-2">{{ currentWeather.weather }}</div>
        <div class="flex justify-center gap-8 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-blue-600">湿度:</span>
            <span>{{ currentWeather.humidity }}%</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600">风速:</span>
            <span>{{ currentWeather.windSpeed }} km/h</span>
          </div>
        </div>
      </div>
      <div v-if="forecast" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-8">
        <div v-for="day, index in forecast" :key="index" class="bg-blue-50 rounded-lg p-4 text-center">
          <div class="text-sm text-blue-600 font-medium mb-2">{{ index === 0 ? '今天' : `第${index + 1}天` }}</div>
          <img :src="day.icon" alt="天气图标" class="w-12 h-12 mx-auto mb-2" />
          <div class="text-lg font-bold mb-1">{{ day.weather }}</div>
          <div class="text-sm">
            <span class="text-blue-600">{{ day.maxTemp }}°C</span>
            <span class="text-gray-500">/ {{ day.minTemp }}°C</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const city = ref('');
const currentWeather = ref(null);
const forecast = ref(null);
const error = ref('');

const queryWeather = async () => {
  if (!city.value.trim()) {
    error.value = '请输入城市名';
    return;
  }
  error.value = '';
  try {
    const response = await $fetch(`/api/forecast?city=${encodeURIComponent(city.value)}`);
    if (response.error) {
      error.value = response.error;
      return;
    }
    currentWeather.value = response.current;
    forecast.value = response.forecast;
  } catch (err) {
    error.value = '获取天气数据失败，请稍后重试';
  }
};
</script>
