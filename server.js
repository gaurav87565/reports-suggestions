require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const app = express();


// Setup Discord bot
const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel]
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Track site visits
app.use((req, res, next) => {
  stats.visitCount++;
  next();
});

// Format uptime function
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600) % 24;
  const days = Math.floor(seconds / 86400) % 30;
  const months = Math.floor(seconds / 2592000);

  const parts = [];
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60} sec`);

  return parts.join(' ');
}

// API: Suggestions handler
app.post('/api/suggestions', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  try {
    const user = await bot.users.fetch(process.env.OWNER_ID);
    const embed = new EmbedBuilder()
      .setTitle('💡 New Suggestion')
      .addFields(
        { name: 'Name', value: name, inline: true },
        { name: 'Suggestion', value: message }
      )
      .setColor(0xffd700)
      .setTimestamp();

    await user.send({ embeds: [embed] });
    res.status(200).json({ success: true, message: '✅ Suggestion sent successfully!' });
  } catch (error) {
    console.error('Failed to send suggestion:', error);
    res.status(500).json({ error: 'Failed to send suggestion. Please try again later.' });
  }
});

// API: Website stats
app.get('/api/stats', (req, res) => {
  stats.pingCount++;
  const uptime = formatUptime(Date.now() - stats.startTime);
  res.json({
    uptime,
    visits: stats.visitCount,
    pings: stats.pingCount
  });
});

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/suggestion', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'suggestions.html'));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});

// Start web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Website running on http://localhost:${PORT}`);
});

// Discord Bot: Ready & Commands
bot.once('ready', async () => {
  try {
    await bot.application.commands.set([
      {
        name: 'stats',
        description: 'Get website stats',
      }
    ]);
    console.log('✅ Slash commands registered');
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err);
  }
});

// Discord Bot: Command Handler
bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === 'stats') {
    const uptime = formatUptime(Date.now() - stats.startTime);
    const embed = new EmbedBuilder()
      .setTitle('📊 Website Stats')
      .addFields(
        { name: 'Uptime', value: uptime },
        { name: 'Visits', value: `${stats.visitCount}` },
        { name: 'Pings', value: `${stats.pingCount}` }
      )
      .setColor(0x00b0f4)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// Start bot
bot.login(process.env.DISCORD_BOT_TOKEN);
