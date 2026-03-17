const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`Bot je online jako ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const command = message.content.slice(PREFIX.length).trim().toLowerCase();

  if (command === 'ping') {
    message.reply('🏓 Bot funguje!');
  }

  if (command === 'setup') {
    message.channel.send('⚙ Setup zatím základní – připraveno na rozšíření.');
  }
});

client.login(process.env.TOKEN);
