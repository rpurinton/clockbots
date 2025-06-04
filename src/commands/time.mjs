import 'dotenv/config';
import log from '../log.mjs';
import moment from 'moment-timezone';
import { getClockEmoji } from '../custom/emoji.mjs';
import { getOffsetStr, formatFullTime } from '../custom/format.mjs';

// Handles the !time & /time commands
export default async function (message) {
  const timezone = process.env.TIMEZONE || 'UTC';
  const now = new Date();
  try {
    const emoji = getClockEmoji(
      parseInt(moment(now).tz(timezone).format('H'), 10),
      parseInt(moment(now).tz(timezone).format('m'), 10)
    );
    const formattedTime = formatFullTime(now, timezone);
    const offsetStr = getOffsetStr(now, timezone);
    await message.reply(`${emoji} ${formattedTime} (${offsetStr})`);
  } catch (err) {
    log.error('Failed to respond to !time:', err);
  }
}
