import 'dotenv/config';
import moment from 'moment-timezone';

/**
 * Returns the GMT offset string for a given date and timezone.
 * @param {Date|string|number} date - The date to format.
 * @param {string} [timezone=process.env.TIMEZONE || 'UTC'] - The IANA timezone name.
 * @returns {string} Offset string in the format 'GMT+2' or 'GMT+2:30'.
 */
export function getOffsetStr(date, timezone = process.env.TIMEZONE || 'UTC') {
  const m = moment(date).tz(timezone);
  const offset = m.format('Z');
  const match = offset.match(/([+-])(\d{2}):(\d{2})/);
  if (match) {
    const sign = match[1] === '+' ? '+' : '-';
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    return `GMT${sign}${hours}` + (minutes !== 0 ? `:${minutes.toString().padStart(2, '0')}` : '');
  }
  return 'GMT';
}

/**
 * Formats a date as a full, human-readable string with timezone abbreviation.
 * Example: 'Friday May 30th, 2025 16:18 CEST'
 * @param {Date|string|number} date - The date to format.
 * @param {string} [timezone=process.env.TIMEZONE || 'UTC'] - The IANA timezone name.
 * @returns {string} Formatted date string.
 */
export function formatFullTime(date, timezone = process.env.TIMEZONE || 'UTC') {
  const m = moment(date).tz(timezone);
  return m.format('dddd MMMM Do, YYYY HH:mm z');
}

/**
 * Formats a date as a short string with timezone abbreviation.
 * Example: 'Fri 5/30 16:18 CEST'
 * @param {Date|string|number} date - The date to format.
 * @param {string} [timezone=process.env.TIMEZONE || 'UTC'] - The IANA timezone name.
 * @returns {string} Formatted date string.
 */
export function formatShortTime(date, timezone = process.env.TIMEZONE || 'UTC') {
  const m = moment(date).tz(timezone);
  return m.format('ddd M/D HH:mm z');
}
