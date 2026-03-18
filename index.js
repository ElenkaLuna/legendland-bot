const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`✅ Bot běží`);

  const guild = client.guilds.cache.first();
  if (!guild) return;

  // ===== ROLE =====
  async function role(name, color, perms = []) {
    let r = guild.roles.cache.find(x => x.name === name);
    if (!r) {
      r = await guild.roles.create({ name, color, permissions: perms });
    }
    return r;
  }

  const majitel = await role('🌸 Majitelka DC', '#ff66cc', [PermissionsBitField.Flags.Administrator]);
  const admin = await role('🛠️ Admin', '#ff0000');
  const mod = await role('🔧 Mod', '#ffaa00');
  const vip = await role('💎 VIP', '#00ffff');
  const hrac = await role('🎮 Hráč', '#00ff88');

  // ===== CATEGORY =====
  async function cat(name) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) c = await guild.channels.create({ name, type: 4 });
    return c;
  }

  const overeni = await cat('📌 Ověření');
  const info = await cat('📚 Informace');
  const chat = await cat('💬 Chat');
  const vipCat = await cat('💎 VIP');
  const adminCat = await cat('🛠️ A-TEAM');

  // ===== CHANNEL =====
  async function ch(name, type, parent, perms = []) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) {
      c = await guild.channels.create({
        name,
        type,
        parent: parent.id,
        permissionOverwrites: perms
      });
    }
    return c;
  }

  // ===== Ověření (jen noví vidí) =====
  await ch('👋│vitej', 0, overeni, [
    { id: guild.roles.everyone.id, allow: ['ViewChannel'] }
  ]);

  await ch('📜│pravidla', 0, overeni);
  await ch('✅│overeni', 0, overeni);

  // ===== Informace =====
  await ch('📘│navody', 0, info);
  await ch('🤖│bot-navod', 0, info);

  // ===== Chat =====
  await ch('💬│chat', 0, chat);
  await ch('🎵│hudba', 0, chat);

  // ===== VIP (jen VIP + staff) =====
  await ch('💎│vip-chat', 0, vipCat, [
    { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
    { id: vip.id, allow: ['ViewChannel'] },
    { id: admin.id, allow: ['ViewChannel'] },
    { id: mod.id, allow: ['ViewChannel'] }
  ]);

  await ch('🔊│vip-hlas', 2, vipCat, [
    { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
    { id: vip.id, allow: ['ViewChannel'] }
  ]);

  // ===== Admin sekce =====
  await ch('📢│admin-oznameni', 0, adminCat, [
    { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
    { id: admin.id, allow: ['ViewChannel'] },
    { id: mod.id, allow: ['ViewChannel'] }
  ]);

  await ch('💬│admin-chat', 0, adminCat, [
    { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
    { id: admin.id, allow: ['ViewChannel'] },
    { id: mod.id, allow: ['ViewChannel'] }
  ]);

  console.log('✅ Kompletní setup hotový');
});

client.login(process.env.TOKEN);
