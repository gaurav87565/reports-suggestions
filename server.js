import express from 'express';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

dotenv.config();

const app = express();
app.use(express.json());

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

bot.once('ready', () => {
  console.log(`✅ Logged in as ${bot.user.tag}`);
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(3000, () => console.log('🌐 Website running on port 3000'));

bot.login(process.env.TOKEN);
