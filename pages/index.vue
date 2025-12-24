<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        🌤️ 聚合天气查询站
      </h1>

      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <input
          v-model="city"
          type="text"
          placeholder="请输入城市名称..."
          class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <button
          @click="fetchWeather"
          class="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:-translate-y-1 transition-all font-semibold"
        >
          查询天气
        </button>
      </div>

      <div v-if="loading" class="text-center text-gray-600">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
        <p>正在获取天气数据...</p>
      </div>

      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-if="currentWeather" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          当前天气 - {{ currentWeather.city }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-xl p-4 text-center">
            <div class="text-4xl font-bold text-gray-800">{{ currentWeather.temperature }}°C</div>
            <div class="text-lg text-gray-600 mt-1">{{ currentWeather.description }}</div>
          </div>
          <div class="bg-blue-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-800">{{ currentWeather.humidity }}%</div>
            <div class="text-lg text-gray-600 mt-1">湿度</div>
          </div>
          <div class="bg-blue-50 rounded-xl p-4 text-center">
            <div class="text-2xl font-bold text-gray-800">{{ currentWeather.windSpeed }} m/s</div>
            <div class="text-lg text-gray-600 mt-1">风速</div>
          </div>
        </div>
      </div>

      <div v-if="forecast.length > 0">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">7天预报</h2>
        <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div
            v-for="day in forecast"
            :key="day.date"
            class="bg-blue-50 rounded-xl p-4 text-center hover:shadow-lg transition-all"
          >
            <div class="font-semibold text-gray-800">{{ day.date }}</div>
            <div class="text-xl font-bold text-gray-800 mt-1">{{ day.temperature }}°C</div>
            <div class="text-sm text-gray-600 mt-1">{{ day.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const city = ref('');
const loading = ref(false);
const error = ref('');
const currentWeather = ref<any>(null);
const forecast = ref<any[]>([]);

const fetchWeather = async () => {
  if (!city.value.trim()) {
    error.value = '请输入城市名称';
    return;
  }

  loading.value = true;
  error.value = '';
  currentWeather.value = null;
  forecast.value = [];

  try {
    // 首先通过OpenStreetMap Nominatim API获取城市坐标（免费无需密钥）
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city.value)}&format=json&limit=1`);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      error.value = '未找到该城市，请检查输入是否正确';
      return;
    }

    const cityData = geoData[0];
    const lat = cityData.lat;
    const lon = cityData.lon;

    // 使用Open-Meteo API获取天气数据
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability,wind_speed_10m_max&forecast_days=7`);
    const data = await response.json();

    if (response.ok) {
      currentWeather.value = {
        city: cityData.display_name.split(',')[0],
        temperature: Math.round(data.current.temperature_2m),
        description: '当前天气',
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m
      };

      const dailyForecast: any[] = [];
      for (let i = 0; i < data.daily.time.length && i < 7; i++) {
        const date = new Date(data.daily.time[i]).toLocaleDateString('zh-CN', { weekday: 'short', month: 'short', day: 'numeric' });
        dailyForecast.push({
          date,
          temperature: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
          description: `${data.daily.precipitation_probability[i]}%降水概率`
        });
      }

      forecast.value = dailyForecast;
    } else {
      error.value = '获取天气数据失败，请稍后重试';
    }
  } catch (err) {
    error.value = '获取天气数据失败，请稍后重试';
    console.error('Weather fetch error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 页面加载时可以默认查询某个城市
  // city.value = '北京';
  // fetchWeather();
});
</script>