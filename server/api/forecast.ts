export default defineEventHandler(async (event) => {
  try {
    const { city } = getQuery(event)
    
    if (!city) {
      throw createError({
        statusCode: 400,
        statusMessage: '城市名称不能为空'
      })
    }

    // 使用 Open-Meteo API 获取天气数据（无需 API Key）
    // 首先通过城市名获取地理坐标
    const geoResponse = await $fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city as string)}&count=1&language=zh&format=json`)
    
    if (!geoResponse.results || geoResponse.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '未找到该城市'
      })
    }

    const { latitude, longitude, name, country } = geoResponse.results[0]

    // 获取当前天气和 7 天预报
    const weatherResponse = await $fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_max&timezone=auto`
    )

    // 天气代码映射
    const weatherCodeMap = {
      0: { icon: '☀️', description: '晴朗' },
      1: { icon: '🌤️', description: '多云' },
      2: { icon: '⛅', description: '多云' },
      3: { icon: '☁️', description: '阴天' },
      45: { icon: '🌫️', description: '雾' },
      48: { icon: '🌫️', description: '雾' },
      51: { icon: '🌦️', description: '毛毛雨' },
      53: { icon: '🌦️', description: '毛毛雨' },
      55: { icon: '🌦️', description: '毛毛雨' },
      61: { icon: '🌧️', description: '小雨' },
      63: { icon: '🌧️', description: '中雨' },
      65: { icon: '🌧️', description: '大雨' },
      71: { icon: '🌨️', description: '小雪' },
      73: { icon: '🌨️', description: '中雪' },
      75: { icon: '🌨️', description: '大雪' },
      77: { icon: '🌨️', description: '雪粒' },
      80: { icon: '🌦️', description: '阵雨' },
      81: { icon: '🌦️', description: '阵雨' },
      82: { icon: '🌦️', description: '强阵雨' },
      85: { icon: '🌨️', description: '阵雪' },
      86: { icon: '🌨️', description: '阵雪' },
      95: { icon: '⛈️', description: '雷雨' },
      96: { icon: '⛈️', description: '雷雨' },
      99: { icon: '⛈️', description: '雷雨' }
    }

    return {
      city: name,
      country,
      current: {
        temperature: weatherResponse.current.temperature_2m,
        humidity: weatherResponse.current.relative_humidity_2m,
        windSpeed: weatherResponse.current.wind_speed_10m,
        weather: weatherCodeMap[weatherResponse.current.weather_code] || { icon: '❓', description: '未知' },
        feelsLike: weatherResponse.current.apparent_temperature
      },
      forecast: weatherResponse.daily.time.map((time: string, index: number) => ({
        date: time,
        weather: weatherCodeMap[weatherResponse.daily.weather_code[index]] || { icon: '❓', description: '未知' },
        maxTemp: weatherResponse.daily.temperature_2m_max[index],
        minTemp: weatherResponse.daily.temperature_2m_min[index],
        humidity: weatherResponse.daily.relative_humidity_2m_mean[index],
        windSpeed: weatherResponse.daily.wind_speed_10m_max[index]
      }))
    }

  } catch (error: any) {
    console.error('获取天气数据失败:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '获取天气数据失败，请稍后重试'
    })
  }
})