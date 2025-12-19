export default defineEventHandler(async (event) => {
  try {
    const { city } = getQuery(event)
    
    if (!city) {
      throw createError({
        statusCode: 400,
        statusMessage: '请提供城市名称'
      })
    }

    // 使用 Open-Meteo 的地理编码 API 获取坐标
    const geoResponse = await $fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city as string)}&count=1&language=zh&format=json`
    )

    if (!geoResponse.results || geoResponse.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '未找到该城市'
      })
    }

    const { latitude, longitude, name, country } = geoResponse.results[0]

    // 获取天气数据
    const weatherResponse = await $fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    )

    // 获取空气质量数据
    const airQualityResponse = await $fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
    )

    return {
      city: name,
      country,
      current: {
        temperature: weatherResponse.current.temperature_2m,
        humidity: weatherResponse.current.relative_humidity_2m,
        windSpeed: weatherResponse.current.wind_speed_10m,
        weatherCode: weatherResponse.current.weather_code,
        airQuality: airQualityResponse.current?.us_aqi || null
      }
    }
  } catch (error) {
    console.error('获取天气数据失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取天气数据失败，请稍后重试'
    })
  }
})