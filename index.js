const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("🔥 Nastavuji LegendLand přesně...");

  // SMAZÁNÍ KANÁLŮ
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  // HELPER
  const cat = async name => await guild.channels.create({ name, type: 4 });
  const text = async (name, parent) => await guild.channels.create({ name, type: 0, parent: parent.id });
  const voice = async (name, parent) => await guild.channels.create({ name, type: 2, parent: parent.id });

  // ===== Ověření
  const overeni = await cat("👋 Ověření");
  await text("👋│vitej", overeni);
  await text("📜│pravidla", overeni);
  await text("✅│overeni", overeni);

  // ===== Informace
  const info = await cat("📢 Informace");
  await text("📢│oznámení", info);
  await text("🧭│jak-se-pripojit", info);
  await text("🌐│hlasovaci-stranky", info);
  await text("🗺│dynmapa", info);
  await text("📱│socialni-site", info);

  // ===== Statistiky
  const stats = await cat("📊 Statistiky");
  await text("📡│server-status", stats);
  await text("👥│hraci-online", stats);

  // ===== Komunita
  const komunita = await cat("💬 Komunita");
  await text("💬│pokec", komunita);
  await text("📷│fotky", komunita);
  await text("💡│napady", komunita);
  await text("🏗│stavby", komunita);
  await text("🗳│hlasovani", komunita);

  // ===== Minecraft
  const mc = await cat("⛏ Minecraft");
  await text("⛏│mc-chat", mc);
  await text("📜│commandy", mc);
  await text("🦠│nemoci", mc);
  await text("🏠│home", mc);
  await text("🏡│residence", mc);

  // ===== Voice
  const voiceCat = await cat("🎤 HLASOVÉ KANÁLY");
  await voice("🔊│Hlas 1", voiceCat);
  await voice("🔊│Hlas 2", voiceCat);
  await voice("🔊│Hlas 3", voiceCat);
  await voice("🎵│Hudba", voiceCat);
  await voice("🌙│AFK", voiceCat);

  // ===== VIP
  const vip = await cat("💎 VIP");
  await text("💬│vipchat", vip);

  const vipVoice = await cat("🎤 HLASOVÉ KANÁLY VIP");
  await voice("🔊│Hlas 1", vipVoice);
  await voice("🔊│Hlas 2", vipVoice);
  await voice("🔊│Hlas 3", vipVoice);
  await voice("🎵│Hudba", vipVoice);

  // ===== Podpora
  const podpora = await cat("🎫 Podpora");
  await text("🎫│podpora", podpora);
  await text("📋│nabory", podpora);

  // ===== A-TEAM
  const team = await cat("🛡 A-TEAM");
  await text("🛠│admin-navod", team);
  await text("📜│admin-pravidla", team);
  await text("🚨│banovaci-system", team);
  await text("💬│admin-chat", team);
  await text("🛡│AT porada", team);
  await text("⚙│technicka-mistnost", team);
  await text("🎉│event-tym", team);
  await text("🏗│stavitele", team);
  await text("🤖│bot-prikazy", team);

  const teamVoice = await cat("🎤 HLASOVÉ KANÁLY AT");
  await voice("🔊│Hlas 1", teamVoice);
  await voice("🔊│Hlas 2", teamVoice);
  await voice("🎵│Hudba", teamVoice);
  await voice("🛡│AT porada", teamVoice);
  await voice("⚙│Technická místnost", teamVoice);
  await voice("🎉│Event tým", teamVoice);
  await voice("🏗│Stavitelé", teamVoice);

  // ===== Logy
  const logy = await cat("📜 LOGY");
  await text("📜│log-zprávy", logy);
  await text("🔨│log-moderace", logy);
  await text("👤│log-členové", logy);
  await text("⚙│log-server", logy);

  // ===== Soukromý
  const priv = await cat("🌸 SOUKROMÝ");
  await text("🌸│majitelka-navod", priv);

  await message.channel.send("✅ HOTOVO – STRUKTURA SEDÍ 1:1");
});

client.login(process.env.TOKEN);
