import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Needed for form data

// Serve static HTML
app.use(express.static(__dirname)); // Serve all HTML files from root

// Routes for HTML pages
app.get('/suggestions', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, 'report.html'));
});

// Discord bot setup
const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

bot.once('ready', () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
});

// Suggestion submission
app.post('/submit', async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).send('Missing username or message');
  }

  try {
    const channel = await bot.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) return res.status(404).send('Channel not found');

    const embed = new EmbedBuilder()
      .setTitle('📩 New Suggestion')
      .addFields(
        { name: 'Username', value: username, inline: true },
        { name: 'Suggestion', value: message }
      )
      .setColor(0x00ff00)
      .setTimestamp();

    const sentMessage = await channel.send({ embeds: [embed] });
    await sentMessage.react('✅');
    await sentMessage.react('❌');

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
    const channel = await bot.channels.fetch(process.env.CHANNEL_ID2);
    if (!channel) return res.status(404).send('Channel not found');

    const embed = new EmbedBuilder()
      .setTitle('📩 New Report')
      .addFields(
        { name: 'Username', value: username, inline: true },
        { name: 'Report', value: message }
      )
      .setColor(0xff0000)
      .setTimestamp();

    const sentMessage = await channel.send({ embeds: [embed] });
    await sentMessage.react('✅');
    await sentMessage.react('❌');

    res.status(200).json({ success: true, message: 'Report submitted to Discord!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error submitting report' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Website running on port ${PORT}`));

bot.login(process.env.TOKEN);
