import 'dotenv/config';
import fetch from 'node-fetch';

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetch sunrise and sunset times for the given coordinates.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [apiKey=process.env.OWM_API_KEY]
 * @param {function} [fetchImpl=fetch] - Optional fetch implementation for testing
 * @returns {Promise<{sunrise: number, sunset: number}>} Unix timestamps (UTC)
 */
export async function fetchSun(latitude, longitude, apiKey = process.env.OWM_API_KEY, fetchImpl = fetch) {
  const url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sunrise/sunset: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.sys || typeof data.sys.sunrise !== 'number' || typeof data.sys.sunset !== 'number') {
    throw new Error('Invalid response from OpenWeatherMap');
  }
  return {
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset
  };
}
