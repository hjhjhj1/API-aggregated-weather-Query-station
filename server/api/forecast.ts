export default defineEventHandler(async (event) => {
  const { city } = getQuery(event)

  if (!city) {
    return { error: '请输入城市名称' }
  }

  try {
    const response = await $fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min`)

    // 提取当前天气和 7 天预报
    const current = response.current
    const forecast = response.daily

    return {
      current,
      forecast
    }
  } catch (error) {
    return { error: '城市不存在或无法获取天气数据' }
  }
})