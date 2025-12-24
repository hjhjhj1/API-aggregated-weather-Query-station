export default defineEventHandler(async (event) => {
  const { city } = getQuery(event);
  if (!city) {
    return { error: '请输入城市名' };
  }
  try {
    const response = await $fetch(`https://wttr.in/${city}?format=j1`);
    const data = await response.json();
    const current = data.current_condition[0];
    return {
      temperature: current.temp_C,
      weather: current.weatherDesc[0].value,
      icon: current.weatherIconUrl[0].value,
      humidity: current.humidity,
      windSpeed: current.windspeedKmph
    };
  } catch (error) {
    return { error: '城市不存在或无法获取天气数据' };
  }
});
