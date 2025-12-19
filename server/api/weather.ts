export default defineEventHandler(async (event) => {
  try {
    const { city } = getQuery(event)
    
    if (!city) {
      throw createError({
        statusCode: 400,
        statusMessage: '城市名称不能为空'
      })
    }

    // 复用 forecast 接口的逻辑，因为当前天气数据已经包含在 forecast 响应中
    const forecastData = await $fetch(`http://localhost:3000/api/forecast?city=${encodeURIComponent(city as string)}`)
    
    return {
      city: forecastData.city,
      country: forecastData.country,
      current: forecastData.current
    }

  } catch (error: any) {
    console.error('获取天气数据失败:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '获取天气数据失败，请稍后重试'
    })
  }
})