import 'dotenv/config';
import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { fetchSun } from '../custom/sun.mjs';
import moment from 'moment-timezone';

// Command handler for !sun 
// Refactored to accept fetchSun as a dependency for testability
export default async function (message, fetchSunDep = fetchSun) {
  try {
    const locale = message.guild.preferredLocale || 'en-US';
    const timezone = process.env.TIMEZONE || 'UTC';
    const latitude = process.env.LOCATION_LAT;
    const longitude = process.env.LOCATION_LON;
    if (!latitude || !longitude) {
      log.error('Location not configured.');
      return;
    }
    const data = await fetchSunDep(latitude, longitude);
    const sunriseLocal = moment.unix(data.sunrise).tz(timezone);
    const sunsetLocal = moment.unix(data.sunset).tz(timezone);
    const sunriseStr = sunriseLocal.format('HH:mm');
    const sunsetStr = sunsetLocal.format('HH:mm');
    const sunriseDiscord = `<t:${data.sunrise}:R>`;
    const sunsetDiscord = `<t:${data.sunset}:R>`;
    const daylightSeconds = data.sunset - data.sunrise;
    const daylightHours = Math.floor(daylightSeconds / 3600);
    const daylightMinutes = Math.floor((daylightSeconds % 3600) / 60);
    const daylightStr = `${daylightHours}h ${daylightMinutes}m`;
    const sunriseLbl = getMsg(locale, 'sunrise', 'Sunrise');
    const sunsetLbl = getMsg(locale, 'sunset', 'Sunset');
    const daylightLbl = getMsg(locale, 'daylight', 'Daylight');
    await message.reply(
      `${sunriseLbl}: ${sunriseStr} (${sunriseDiscord})\n${sunsetLbl}: ${sunsetStr} (${sunsetDiscord})\n${daylightLbl}: ${daylightStr}`
    );
  } catch (err) {
    log.error('Failed to respond to !sun:', err);
    const locale = message.guild.preferredLocale || 'en-US';
    const errorMsg = getMsg(locale, 'sun_error', 'Failed to fetch sunrise/sunset times.');
    await message.reply(errorMsg);
  }
}
