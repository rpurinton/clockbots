import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Event handler for messageCreate
export default async function (message) {
    log.debug('messageCreate', { message });
    if (message.author.bot) return;
    if (message.content === '!time') {
        const handler = (await import('../commands/time.mjs')).default;
        await handler(message);
        return;
    }
    if (message.content === '!sun') {
        const handler = (await import('../commands/sun.mjs')).default;
        await handler(message);
        return;
    }
}
