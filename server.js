const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Discord Bot Setup
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

bot.once('ready', () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
});

// Endpoint for form submission
app.post('/submit', async (req, res) => {
  const { username, message } = req.body;

  const channel = await bot.channels.fetch(process.env.CHANNEL_ID);
  if (!channel) return res.status(500).send('Channel not found');

  const embed = new EmbedBuilder()
    .setTitle('New Form Submission')
    .addFields(
      { name: 'Username', value: username },
      { name: 'Message', value: message }
    )
    .setColor(0x00ff00)
    .setTimestamp();

  const sentMessage = await channel.send({ embeds: [embed] });

  // Add ✅ and ❌ reactions
  await sentMessage.react('✅');
  await sentMessage.react('❌');

  res.status(200).send('Form submitted to Discord!');
});

app.listen(3000, () => console.log('🌐 Website running on http://localhost:3000'));

bot.login(process.env.TOKEN);
