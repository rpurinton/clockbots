import log from '../log.mjs';
import { getMsg } from '../locales.mjs';

// Command handler for /help
// Refactored to accept logger and getMsgDep for testability
export default async function (
  interaction,
  { logger = log, getMsgDep = getMsg } = {}
) {
    try {
        const helpContent = getMsgDep(interaction.locale, "help", "No help available for this command.", logger);
        await interaction.reply({
            content: helpContent,
            flags: 1 << 6, // EPHEMERAL
        });
    } catch (err) {
        logger.error("Error in /help handler", err);
        try {
            await interaction.reply({
                content: "An error occurred while processing your request.",
                flags: 1 << 6,
            });
        } catch (e) {
            logger.error("Failed to reply with error message", e);
        }
    }
}
