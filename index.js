const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`✅ Bot běží`);

  const guild = client.guilds.cache.first();

  if (!guild) return;

  // ===== ROLE =====
  const roles = [
    { name: '🌸 Majitelka DC', color: '#ff66cc' },
    { name: '🎮 Hráč', color: '#00ff88' },
    { name: '💎 VIP', color: '#00ffff' }
  ];

  for (const r of roles) {
    if (!guild.roles.cache.find(role => role.name === r.name)) {
      await guild.roles.create({ name: r.name, color: r.color });
    }
  }

  // ===== CATEGORY =====
  async function createCat(name) {
    let c = guild.channels.cache.find(ch => ch.name === name);
    if (!c) {
      c = await guild.channels.create({ name, type: 4 });
    }
    return c;
  }

  const overeni = await createCat('📌 Ověření');
  const info = await createCat('📚 Informace');
  const chat = await createCat('💬 Chat');
  const vip = await createCat('💎 VIP');

  // ===== CHANNEL =====
  async function createCh(name, type, parent) {
    if (!guild.channels.cache.find(c => c.name === name)) {
      await guild.channels.create({
        name,
        type,
        parent: parent.id
      });
    }
  }

  await createCh('👋│vitej', 0, overeni);
  await createCh('📜│pravidla', 0, overeni);
  await createCh('✅│overeni', 0, overeni);

  await createCh('📘│navody', 0, info);
  await createCh('🤖│bot-navod', 0, info);

  await createCh('💬│chat', 0, chat);
  await createCh('🎵│hudba', 0, chat);

  await createCh('💎│vip-chat', 0, vip);
  await createCh('🔊│vip-hlas', 2, vip);

  console.log('✅ Server automaticky opraven');
});

client.login(process.env.TOKEN);
