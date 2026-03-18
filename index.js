const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log("✅ LegendLand FINAL READY");
});

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("⚙ Nastavuji server podle finálního návrhu...");

  // ===== ROLE =====
  const role = (name) => guild.roles.cache.find(r => r.name === name);

  const VIP = role("💎 VIP") || role("VIP");
  const ADMIN = role("Admin");
  const MOD = role("Mod");
  const HRAC = role("Hráč");

  // ===== CATEGORY HELPER =====
  async function getCategory(name) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) c = await guild.channels.create({ name, type: 4 });
    return c;
  }

  // ===== CHANNEL HELPER =====
  async function createText(name, parent, perms = []) {
    let ch = guild.channels.cache.find(c => c.name === name);
    if (!ch) {
      ch = await guild.channels.create({
        name,
        type: 0,
        parent: parent.id,
        permissionOverwrites: perms
      });
    }
  }

  async function createVoice(name, parent, perms = []) {
    let ch = guild.channels.cache.find(c => c.name === name);
    if (!ch) {
      ch = await guild.channels.create({
        name,
        type: 2,
        parent: parent.id,
        permissionOverwrites: perms
      });
    }
  }

  // ===== OVĚŘENÍ =====
  const overeni = await getCategory("👋 Ověření");

  await createText("👋│vitej", overeni);
  await createText("📜│pravidla", overeni);
  await createText("✅│overeni", overeni);

  // ===== INFORMACE =====
  const info = await getCategory("📢 Informace");

  await createText("📢│oznámení", info);
  await createText("🌐│hlasovaci-stranky", info);

  // ===== KOMUNITA =====
  const chat = await getCategory("💬 Komunita");

  await createText("💬│pokec", chat);

  // ===== VIP =====
  const vip = await getCategory("💎 VIP");

  await createText("💎│vip-chat", vip, [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: VIP?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await createVoice("🔊│vip-hlas", vip, [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: VIP?.id, allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.Connect
    ]}
  ]);

  // ===== A-TEAM =====
  const team = await getCategory("🛠 A-TEAM");

  await createText("📢│admin-oznameni", team, [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] },
    { id: MOD?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await createText("💬│admin-chat", team, [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] },
    { id: MOD?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await createText("🔨│banovaci-system", team, [
    { id: guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  // ===== NÁVODY =====
  const navody = await getCategory("📘 Návody");

  await createText("📘│navody", navody);
  await createText("🤖│bot-navod", navody);
  await createText("🎵│hudba", navody);

  await message.channel.send("✅ HOTOVO – server nastaven podle návrhu");
});

client.login(process.env.TOKEN);
