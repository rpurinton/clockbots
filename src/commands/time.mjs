import 'dotenv/config';
import log from '../log.mjs';
import moment from 'moment-timezone';
import { getClockEmoji } from '../custom/emoji.mjs';
import { getOffsetStr, formatFullTime } from '../custom/format.mjs';

// Handles the !time & /time commands
// Refactored to accept logger, clockEmoji, formatFullTime, and getOffsetStr for testability
export default async function (
  message,
  {
    logger = log,
    getClockEmojiDep = getClockEmoji,
    formatFullTimeDep = formatFullTime,
    getOffsetStrDep = getOffsetStr,
    momentDep = moment
  } = {}
) {
  const timezone = process.env.TIMEZONE || 'UTC';
  const now = new Date();
  try {
    const emoji = getClockEmojiDep(
      parseInt(momentDep(now).tz(timezone).format('H'), 10),
      parseInt(momentDep(now).tz(timezone).format('m'), 10)
    );
    const formattedTime = formatFullTimeDep(now, timezone);
    const offsetStr = getOffsetStrDep(now, timezone);
    await message.reply(`${emoji} ${formattedTime} (${offsetStr})`);
  } catch (err) {
    logger.error('Failed to respond to !time:', err);
  }
}
