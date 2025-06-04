import 'dotenv/config';
import log from '../log.mjs';
import { getMsg } from '../locales.mjs';
import { getClockEmoji } from '../custom/emoji.mjs';
import { formatShortTime } from '../custom/format.mjs';
import moment from 'moment-timezone';

// Event handler for ready
export default async function (client) {
    log.info(`Logged in as ${client.user.tag}`);
    await updatePresence();
    setInterval(updatePresence, 10000);
}

async function updatePresence() {
    const timezone = process.env.TIMEZONE || 'UTC';
    const now = new Date();
    const m = moment(now).tz(timezone);
    const hour = parseInt(m.format('H'), 10);
    const minute = parseInt(m.format('m'), 10);
    const emoji = getClockEmoji(hour, minute);
    const timeString = `${emoji} ${formatShortTime(now, timezone)}`;
    try {
        await client.user.setPresence({
            activities: [{ name: timeString, type: 4 }],
            status: 'online',
        });
    } catch (err) {
        log.error('Failed to update presence:', err);
    }
}