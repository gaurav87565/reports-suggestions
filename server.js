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

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/report', (req, res) => {
  res.sendFile(path.join(__dirname, 'report.html'));
});

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

bot.once('ready', () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { username, message } = req.body;

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

    res.status(200).send('Suggestion submitted to Discord!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting suggestion');
  }
});

// Handle form submission
app.post('/submits', async (req, res) => {
  const { username, message } = req.body;

  try {
    const channel = await bot.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) return res.status(404).send('Channel not found');

    const embed = new EmbedBuilder()
      .setTitle('📩 New Report')
      .addFields(
        { name: 'Username', value: username, inline: true },
        { name: 'Report', value: message }
      )
      .setColor(0x00ff00)
      .setTimestamp();

    const sentMessage = await channel.send({ embeds: [embed] });
    await sentMessage.react('✅');
    await sentMessage.react('❌');

    res.status(200).send('Report submitted to Discord!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting Report');
  }
});
app.listen(3000, () => console.log('🌐 Website running on port 3000'));

bot.login(process.env.TOKEN);