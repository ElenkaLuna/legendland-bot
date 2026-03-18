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
  console.log("✅ LegendLand FINAL");
});

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("⚙ Nastavuji přesně podle dokumentu...");

  const getRole = (name) => guild.roles.cache.find(r => r.name === name);

  const EVERYONE = guild.roles.everyone;
  const VIP = getRole("💎 VIP");
  const ADMIN = getRole("⚔ Admin") || getRole("Admin");
  const HELPER = getRole("🛟 Helper") || getRole("Helper");
  const TECH = getRole("🔧 Technik") || getRole("Technik");

  // ===== HELPER FUNKCE =====
  async function cat(name) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) c = await guild.channels.create({ name, type: 4 });
    return c;
  }

  async function text(name, parent, perms = []) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) {
      c = await guild.channels.create({
        name,
        type: 0,
        parent: parent.id,
        permissionOverwrites: perms
      });
    }
  }

  async function voice(name, parent, perms = []) {
    let c = guild.channels.cache.find(x => x.name === name);
    if (!c) {
      c = await guild.channels.create({
        name,
        type: 2,
        parent: parent.id,
        permissionOverwrites: perms
      });
    }
  }

  // ===== OVĚŘENÍ =====
  const overeni = await cat("👋 Ověření");

  await text("👋│vitej", overeni);
  await text("📜│pravidla", overeni);
  await text("✅│overeni", overeni);

  // ===== INFORMACE =====
  const info = await cat("📢 Informace");

  await text("📢│oznámení", info);
  await text("🧭│jak-se-pripojit", info);
  await text("🌐│hlasovaci-stranky", info);
  await text("🗺│dynmapa", info);
  await text("📱│socialni-site", info);

  // ===== STATISTIKY =====
  const stats = await cat("📊 Statistiky");

  await text("📡│server-status", stats);

  // ===== KOMUNITA =====
  const komunita = await cat("💬 Komunita");

  await text("💬│pokec", komunita);
  await text("📷│fotky", komunita);
  await text("💡│napady", komunita);
  await text("🏗│stavby", komunita);
  await text("🗳│hlasovani", komunita);

  // ===== MINECRAFT =====
  const mc = await cat("⛏ Minecraft");

  await text("⛏│mc-chat", mc);
  await text("📜│commandy", mc);
  await text("🦠│nemoci", mc);
  await text("🏠│home", mc);
  await text("🏡│residence", mc);

  // ===== HLASOVÉ =====
  const voiceCat = await cat("🎤 HLASOVÉ KANÁLY");

  await voice("🔊│Hlas 1", voiceCat);
  await voice("🔊│Hlas 2", voiceCat);
  await voice("🔊│Hlas 3", voiceCat);
  await voice("🎵│Hudba", voiceCat);
  await voice("🌙│AFK", voiceCat);

  // ===== VIP =====
  const vip = await cat("💎 VIP");

  await text("💬│vipchat", vip, [
    { id: EVERYONE.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: VIP?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  // ===== PODPORA =====
  const podpora = await cat("🎫 Podpora");

  await text("🎫│podpora", podpora);
  await text("📋│nabory", podpora);

  // ===== A-TEAM =====
  const team = await cat("🛡 A-TEAM");

  await text("🛠│admin-navod", team, [
    { id: EVERYONE.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await text("📜│admin-pravidla", team, [
    { id: EVERYONE.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await text("🚨│banovaci-system", team, [
    { id: EVERYONE.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  await text("💬│admin-chat", team, [
    { id: EVERYONE.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    { id: ADMIN?.id, allow: [PermissionsBitField.Flags.ViewChannel] }
  ]);

  // ===== LOGY =====
  const logy = await cat("📜 Logy");

  await text("📜│log-zprávy", logy);
  await text("🔨│log-moderace", logy);
  await text("👤│log-členové", logy);
  await text("⚙│log-server", logy);

  await message.channel.send("✅ HOTOVO – přesně podle dokumentu");
});

client.login(process.env.TOKEN);
