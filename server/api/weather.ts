export default defineEventHandler(async (event) => {
  const { city } = getQuery(event);
  
  if (!city || typeof city !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: '请提供城市名',
    });
  }

  try {
    // 第一步：使用地理编码API获取城市坐标
    const geocodeResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`
    );
    
    if (!geocodeResponse.ok) {
      throw new Error('获取城市坐标失败');
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '未找到该城市',
      });
    }
    
    const { latitude, longitude } = geocodeData.results[0];
    
    // 第二步：使用open-meteo API查询天气数据
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,cloud_cover,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('获取天气数据失败');
    }
    
    const weatherData = await weatherResponse.json();
    
    // 转换天气代码为天气描述
    const weatherCodes = {
      0: '晴天',
      1: '多云',
      2: '多云',
      3: '多云',
      45: '雾',
      48: '雾',
      51: '小雨',
      53: '小雨',
      55: '小雨',
      56: '冻雨',
      57: '冻雨',
      61: '中雨',
      63: '中雨',
      65: '大雨',
      66: '冻雨',
      67: '冻雨',
      71: '小雪',
      73: '小雪',
      75: '大雪',
      77: '雪粒',
      80: '阵雨',
      81: '阵雨',
      82: '阵雨',
      85: '阵雪',
      86: '阵雪',
      95: '雷暴',
      96: '雷暴伴冰雹',
      99: '雷暴伴冰雹',
    };
    
    // 处理当前天气
    const currentWeather = {
      temperature: Math.round(weatherData.current.temperature_2m),
      humidity: weatherData.current.relative_humidity_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      weather: weatherCodes[weatherData.current.weather_code] || '未知',
    };
    
    // 处理7天预报
    const forecast = weatherData.daily.time.map((date: string, index: number) => ({
      date: new Date(date).toLocaleDateString('zh-CN'),
      temperature: Math.round((weatherData.daily.temperature_2m_max[index] + weatherData.daily.temperature_2m_min[index]) / 2),
      weather: weatherCodes[weatherData.daily.weather_code[index]] || '未知',
    }));
    
    return {
      current: currentWeather,
      forecast: forecast,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode: error.message === '未找到该城市' ? 404 : 500,
        statusMessage: error.message,
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: '查询天气失败',
    });
  }
});