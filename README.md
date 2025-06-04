# clockbots

`Clockbots` is a simple Discord.js app for displaying the time and sunrise/sunset.

This project is forked from, and tracks upstream changes from, the [Skeleton](https://github.com/rpurinton/skeleton) framework.

---

## Features

- Updates app Presence/Status with current time for specified timezone
- Displays the best hour/half-hour clock emoji
- Supports running multiple Discord apps, each with its own specific location/timezone (uses systemd templates)
- `/time` and `!time` to display the current time in chat
- `/sun` and `!sun` to display current sunrise/sunset times (Requires a free OpenWeatherMap API key)
- Easily extensible with custom commands and events

---

## Getting Started

### 1. Fork this repository

It's recommended to [fork](https://github.com/rpurinton/clockbots/fork) this repo to your own GitHub account before making changes. This allows you to pull upstream updates easily.

### 2. Clone your fork

```sh
# Replace <your-username> with your GitHub info
cd /opt
git clone https://github.com/<your-username>/clockbots.git
cd clockbots
```

### 3. Install dependencies

```sh
cd /opt/clockbots
npm install
```

### 4. Configure environment

Copy `.env.example` to `.env.<identifier>`

For this example, we will run two different Discord apps simultaneously.

```sh
cd /opt/clockbots
cp .env.example .env.nyc
cp .env.example .env.la
```

Edit the `.env.nyc` file (replace values as needed):

```env
LOG_LEVEL=info
DISCORD_CLIENT_ID=your_id_for_nyc_app
DISCORD_TOKEN=your_token_for_nyc_app
OWM_API_KEY=your_key
TIMEZONE=America/New_York
LOCATION_CITY=New York
LOCATION_STATE=NY
LOCATION_COUNTRY=USA
LOCATION_LAT=40.7128
LOCATION_LON=-74.0060
```

Edit the `.env.la` file (replace values as needed):

```env
LOG_LEVEL=info
DISCORD_CLIENT_ID=your_id_for_la_app
DISCORD_TOKEN=your_token_for_la_app
OWM_API_KEY=your_key
TIMEZONE=America/Los_Angeles
LOCATION_CITY=Los Angeles
LOCATION_STATE=CA
LOCATION_COUNTRY=USA
LOCATION_LAT=34.0522
LOCATION_LON=-118.2437
```

### 5. Run Tests (Optional)

To confirm everything is in good working order, run:

```sh
cd /opt/clockbots
npm test
```

### 6. Set up systemd unit template file

To run your app as a service on Linux, use the provided `clockbot@.service` unit file.

Edit the service file as needed:

- Set `WorkingDirectory`, `ExecStart`, and `EnvironmentFile` to your app's location and main file if different.
- Use absolute paths.
- Change `User` and `Group` to a non-root user for security.

Example `clockbot@.service`:

```ini
[Unit]
Description=clockbot %i
After=network-online.target
Wants=network-online.target
StartLimitBurst=3
StartLimitIntervalSec=60

[Service]
User=appuser
Group=appgroup
RestartSec=5
Restart=on-failure
WorkingDirectory=/opt/clockbots
ExecStart=/opt/clockbots/clockbot.mjs
EnvironmentFile=/opt/clockbots/.env.%i

[Install]
WantedBy=multi-user.target
```

**Instructions:**

1. Copy the service file and start the services:

   ```sh
   sudo cp clockbot\@.service /usr/lib/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable clockbot@nyc.service --now
   sudo systemctl enable clockbot@la.service --now
   sudo systemctl status clockbot@nyc.service
   sudo systemctl status clockbot@la.service
   ```

---

## Customization

### Adding Commands

- Place a JSON definition (e.g., `help.json`) in `src/commands/`.
- Add a handler file with the same name and `.mjs` extension (e.g., `help.mjs`) in the same folder.
- The handler should export a default async function.

Example: `src/commands/ping.json`

```json
{
  "name": "ping",
  "description": "Replies with Pong!"
}
```

Example: `src/commands/ping.mjs`

```js
export default async (interaction) => {
  await interaction.reply('Pong!');
};
```

### Adding Events

- Place a file named after the Discord event (e.g., `messageCreate.mjs`) in `src/events/`.
- Export a default function that takes the event arguments.

Example: `src/events/messageCreate.mjs`

```js
export default (message) => {
  if (message.content === '!hello') {
    message.reply('Hello!');
  }
};
```

### Locales

- Add or edit JSON files in `src/locales/` (e.g., `en-US.json`, `fr.json`).
- Each file should export a flat object of key-value pairs.
- The app loads all locale files at startup and makes them available globally.

### Logging

- Logging is handled by Winston.
- Set `LOG_LEVEL` in your `.env` file to one of: `debug`, `info`, `warn`, or `error`.

### Error Handling & Shutdown

- Uncaught exceptions and rejections are logged.
- Graceful shutdown on `SIGTERM`, `SIGINT`, or `SIGHUP`.
- The app will attempt to destroy the Discord client cleanly before exiting.

---

## Folder Structure

```text
src/
  custom/      # Custom code for clockbots
  commands/    # Command definitions and handlers
  events/      # Event handlers
  locales/     # Locale JSON files
  *.mjs       # Core logic (commands, events, logging, etc.)
```

---

## Best Practices & Tips

- **Keep your app token secret!** Never commit your `.env` file or token to version control.
- **Use a dedicated, non-root user** for running your app in production.
- **Regularly pull upstream changes** if you want to keep your fork up to date.
- **Write tests** for your command and event handlers if your app grows in complexity.
- **Check Discord.js documentation** for new features and event names: [https://discord.js.org/](https://discord.js.org/)

---

## License

This project is licensed under the [MIT](LICENSE) License.

## Developer Support

Email: <russell.purinton@gmail.com>
Discord: laozi101
