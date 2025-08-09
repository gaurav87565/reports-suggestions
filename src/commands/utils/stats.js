const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const stats = require('../../stats-tracker');

// Reusable function to format uptime
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600) % 24;
  const days = Math.floor(seconds / 86400) % 30;
  const months = Math.floor(seconds / 2592000); // approx 30 days

  const parts = [];
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60} sec`);

  return parts.join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Get website stats'),

  async execute(interaction) {
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
  },
};
