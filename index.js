const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');
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
    if (!c) {
      c = await guild.channels.create({
        name,
        type: ChannelType.GuildCategory
      });
    }
    return c;
  }

  const vipCat = await cat('💎 VIP');

  // ❗ HARD LOCK VIP
  await vipCat.permissionOverwrites.set([
    {
      id: guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: vip.id,
      allow: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: admin.id,
      allow: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: mod.id,
      allow: [PermissionsBitField.Flags.ViewChannel]
    }
  ]);

  // ===== CHANNEL =====
  async function ch(name, type, parent) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) {
      c = await guild.channels.create({
        name,
        type,
        parent: parent.id
      });
    }
    return c;
  }

  // VIP CHANNELS (vezmou práva z kategorie)
  await ch('💎│vip-chat', ChannelType.GuildText, vipCat);
  await ch('🔊│vip-hlas', ChannelType.GuildVoice, vipCat);

  console.log('✅ VIP JE ZAMČENÉ SPRÁVNĚ');
});

client.login(process.env.TOKEN);
