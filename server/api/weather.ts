export default defineEventHandler(async (event) => {
  const { city } = getQuery(event)

  if (!city) {
    return { error: '请输入城市名称' }
  }

  try {
    // 首先获取城市的经纬度（使用 Open-Meteo 的地理编码 API）
    const geocodeResponse = await $fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=zh&format=json`)

    if (!geocodeResponse.results || geocodeResponse.results.length === 0) {
      return { error: '城市不存在或无法获取地理编码信息' }
    }

    const { latitude, longitude, name } = geocodeResponse.results[0]

    // 调用 Open-Meteo API 获取天气数据
    const weatherResponse = await $fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min`)

    // 转换为前端期望的格式
    const currentWeather = {
      main: {
        temp: weatherResponse.current.temperature_2m,
        feels_like: weatherResponse.current.temperature_2m,
        humidity: weatherResponse.current.relative_humidity_2m,
        pressure: weatherResponse.current.pressure_msl,
      },
      weather: [{
        main: getWeatherMain(weatherResponse.current.temperature_2m),
        description: getWeatherDescription(weatherResponse.current.temperature_2m),
        icon: getWeatherIcon(weatherResponse.current.temperature_2m)
      }],
      wind: {
        speed: weatherResponse.current.wind_speed_10m
      },
      visibility: weatherResponse.current.visibility ? weatherResponse.current.visibility * 1000 : 10000
    }

    // 生成 7 天预报数据
    const forecast = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      forecast.push({
        dt_txt: dateStr,
        main: {
          temp: weatherResponse.daily.temperature_2m_max[i]
        },
        weather: [{
          main: getWeatherMain(weatherResponse.daily.temperature_2m_max[i]),
          description: getWeatherDescription(weatherResponse.daily.temperature_2m_max[i]),
          icon: getWeatherIcon(weatherResponse.daily.temperature_2m_max[i])
        }]
      })
    }

    return {
      current: currentWeather,
      forecast: forecast
    }
  } catch (error) {
    console.error('获取天气数据失败:', error)
    return { error: '获取天气数据失败，请稍后重试' }
  }
})

function getWeatherMain(temperature: number) {
  if (temperature < 0) return 'Snow'
  if (temperature < 10) return 'Clouds'
  if (temperature < 20) return 'Rain'
  return 'Clear'
}

function getWeatherDescription(temperature: number) {
  if (temperature < 0) return '下雪'
  if (temperature < 10) return '多云'
  if (temperature < 20) return '下雨'
  return '晴朗'
}

function getWeatherIcon(temperature: number) {
  if (temperature < 0) return '13d'
  if (temperature < 10) return '03d'
  if (temperature < 20) return '10d'
  return '01d'
}