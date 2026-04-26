/**
 * 날씨 정보 서비스
 * 공공데이터포털 기상청 API 연동 예정
 */

const MOCK_WEATHER = {
  condition: 'clear', // 'clear' | 'cloudy' | 'rainy' | 'snowy'
  temp: 22,
  feelsLike: 20,
  humidity: 55,
  description: '맑음',
  icon: '☀️',
}

/**
 * @param {{ lat: number, lng: number }} coords
 * @returns {Promise<object>}
 */
export async function getCurrentWeather(coords) {
  // TODO: 기상청 API 또는 OpenWeatherMap 연동
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_WEATHER
}

/**
 * 날씨 기반으로 우천 모드 여부를 판단합니다.
 * @param {object} weather
 * @returns {boolean}
 */
export function isRainy(weather) {
  return weather.condition === 'rainy'
}
