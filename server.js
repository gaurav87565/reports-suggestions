import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, EmbedBuilder, ChannelType } from 'discord.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Routes
app.get('/suggestions', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, 'report.html'));
});

// Discord bot
const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

bot.once('ready', () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
});

async function sendToDiscord(channelId, title, fields, color) {
  const channel = await bot.channels.fetch(channelId);

  if (!channel || channel.type !== ChannelType.GuildText) {
    throw new Error(`Channel ${channelId} is not a text channel or doesn't exist`);
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .addFields(...fields)
    .setColor(color)
    .setTimestamp();

  const sentMessage = await channel.send({ embeds: [embed] });
  await sentMessage.react('✅');
  await sentMessage.react('❌');
}

// Suggestion submission
app.post('/submit', async (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).send('Missing username or message');
  }
  try {
    await sendToDiscord(
      process.env.CHANNEL_ID,
      '📩 New Suggestion',
      [
        { name: 'Username', value: username, inline: true },
        { name: 'Suggestion', value: message }
      ],
      0x00ff00
    );
    res.status(200).json({ success: true, message: 'Suggestion submitted to Discord!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error submitting suggestion' });
  }
});

// Report submission
app.post('/submits', async (req, res) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).send('Missing username or message');
  }
  try {
    await sendToDiscord(
      process.env.CHANNEL_ID2,
      '📩 New Report',
      [
        { name: 'Username', value: username, inline: true },
        { name: 'Report', value: message }
      ],
      0xff0000
    );
    res.status(200).json({ success: true, message: 'Report submitted to Discord!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error submitting report' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Website running on port ${PORT}`));

bot.login(process.env.TOKEN);
