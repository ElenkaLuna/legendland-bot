const { 
  Client, 
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// LOCK
async function lock(channel, guild) {
  await channel.permissionOverwrites.edit(guild.roles.everyone, {
    SendMessages: false,
    AddReactions: false
  });
}

// HIDE (pro staff)
async function hide(channel, guild) {
  await channel.permissionOverwrites.edit(guild.roles.everyone, {
    ViewChannel: false
  });
}

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("🔥 Kompletní setup...");

  // SMAZAT
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  const cat = async name => await guild.channels.create({ name, type: 4 });
  const text = async (name, parent) => await guild.channels.create({ name, type: 0, parent: parent.id });
  const voice = async (name, parent) => await guild.channels.create({ name, type: 2, parent: parent.id });

  // ===== Ověření
  const overeni = await cat("👋 Ověření");
  const vitej = await text("👋│vitej", overeni);
  const pravidla = await text("📜│pravidla", overeni);
  const overeniCh = await text("✅│overeni", overeni);

  await lock(vitej, guild);
  await lock(pravidla, guild);
  await lock(overeniCh, guild);

  // ===== Informace
  const info = await cat("📢 Informace");
  const oznameni = await text("📢│oznámení", info);
  const jak = await text("🧭│jak-se-pripojit", info);
  const hlas = await text("🌐│hlasovaci-stranky", info);
  const dyn = await text("🗺│dynmapa", info);
  await text("📱│socialni-site", info);

  await lock(oznameni, guild);
  await lock(hlas, guild);
  await lock(dyn, guild);

  // ===== Statistiky
  const stats = await cat("📊 Statistiky");
  const status = await text("📡│server-status", stats);
  await text("👥│hraci-online", stats);

  await lock(status, guild);

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

  // ===== A-TEAM (SKRYTÉ)
  const team = await cat("🛡 A-TEAM");

  const at1 = await text("🛠│admin-navod", team);
  const at2 = await text("📜│admin-pravidla", team);
  const at3 = await text("🚨│banovaci-system", team);
  await text("💬│admin-chat", team);
  await text("🛡│AT porada", team);
  await text("⚙│technicka-mistnost", team);
  await text("🎉│event-tym", team);
  await text("🏗│stavitele", team);
  await text("🤖│bot-prikazy", team);

  await hide(team, guild);

  await lock(at1, guild);
  await lock(at2, guild);
  await lock(at3, guild);

  // ===== AT VOICE
  const teamVoice = await cat("🎤 HLASOVÉ KANÁLY AT");
  await voice("🔊│Hlas 1", teamVoice);
  await voice("🔊│Hlas 2", teamVoice);
  await voice("🎵│Hudba", teamVoice);
  await voice("🛡│AT porada", teamVoice);
  await voice("⚙│Technická místnost", teamVoice);
  await voice("🎉│Event tým", teamVoice);
  await voice("🏗│Stavitelé", teamVoice);

  await hide(teamVoice, guild);

  // ===== LOGY
  const logy = await cat("📜 LOGY");

  const l1 = await text("📜│log-zprávy", logy);
  const l2 = await text("🔨│log-moderace", logy);
  const l3 = await text("👤│log-členové", logy);
  const l4 = await text("⚙│log-server", logy);

  await hide(logy, guild);

  await lock(l1, guild);
  await lock(l2, guild);
  await lock(l3, guild);
  await lock(l4, guild);

  // ===== SOUKROMÝ
  const priv = await cat("🌸 SOUKROMÝ");
  await text("🌸│majitelka-navod", priv);

  await hide(priv, guild);

  await message.channel.send("✅ HOTOVO – TEĎ JE TO 1:1");
});

client.login(process.env.TOKEN);
