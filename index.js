const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log(`✅ Bot je online jako ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!setup') {
    const guild = message.guild;

    // ===== ROLE =====
    async function getOrCreateRole(name, color, perms = []) {
      let role = guild.roles.cache.find(r => r.name === name);
      if (!role) {
        role = await guild.roles.create({
          name,
          color,
          permissions: perms
        });
      }
      return role;
    }

    const majitel = await getOrCreateRole('🌸 Majitelka DC', '#ff66cc', [PermissionsBitField.Flags.Administrator]);
    const hrac = await getOrCreateRole('🎮 Hráč', '#00ff88');

    // ===== CATEGORY =====
    async function getOrCreateCategory(name) {
      let cat = guild.channels.cache.find(c => c.name === name && c.type === 4);
      if (!cat) {
        cat = await guild.channels.create({
          name,
          type: 4
        });
      }
      return cat;
    }

    const overeniCat = await getOrCreateCategory('📌 Ověření');
    const infoCat = await getOrCreateCategory('📚 Informace');
    const chatCat = await getOrCreateCategory('💬 Chat');
    const vipCat = await getOrCreateCategory('💎 VIP');

    // ===== CHANNEL =====
    async function getOrCreateChannel(name, type, parent, perms = []) {
      let ch = guild.channels.cache.find(c => c.name === name);
      if (!ch) {
        ch = await guild.channels.create({
          name,
          type,
          parent,
          permissionOverwrites: perms
        });
      }
      return ch;
    }

    // ===== CHANNELS =====
    await getOrCreateChannel('👋│vitej', 0, overeniCat.id);
    await getOrCreateChannel('📜│pravidla', 0, overeniCat.id);
    await getOrCreateChannel('✅│overeni', 0, overeniCat.id);

    await getOrCreateChannel('📘│navody', 0, infoCat.id);
    await getOrCreateChannel('🤖│bot-navod', 0, infoCat.id);

    await getOrCreateChannel('💬│chat', 0, chatCat.id);
    await getOrCreateChannel('🎵│hudba', 0, chatCat.id);

    await getOrCreateChannel('💎│vip-chat', 0, vipCat.id);
    await getOrCreateChannel('🔊│vip-hlas', 2, vipCat.id);

    message.reply('✅ Server opraven (bez mazání)');
  }
});

client.login(process.env.TOKEN);
