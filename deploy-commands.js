require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Store all commands to register
const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');

// Function to recursively get all command files from the specified directory
const getAllCommandFiles = (dir) => {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllCommandFiles(filePath)); // Recurse into subdirectories
    } else if (file.name.endsWith('.js')) {
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON()); // Push command data to the commands array
      }
    }
  });
  return results;
};

// Get all command files from the 'commands' folder
getAllCommandFiles(commandsPath);

// Create a new REST instance and set the bot token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Make a request to Discord API to register commands globally
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // Use the CLIENT_ID from environment variables
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error while refreshing commands:', error);
  }
})();
