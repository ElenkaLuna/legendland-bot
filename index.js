const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("🔥 Kompletní nastavení...");

  // SMAZÁNÍ
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  const cat = async name => await guild.channels.create({ name, type: 4 });
  const text = async (name, parent) => await guild.channels.create({ name, type: 0, parent: parent.id });
  const voice = async (name, parent) => await guild.channels.create({ name, type: 2, parent: parent.id });

  const lock = async ch => {
    await ch.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
  };

  // ROLE
  const vip = guild.roles.cache.find(r => r.name.includes("VIP"));

  const atRoles = guild.roles.cache.filter(r =>
    r.name.includes("Admin") ||
    r.name.includes("Helper") ||
    r.name.includes("Technik") ||
    r.name.includes("Stavitel") ||
    r.name.includes("Eventer") ||
    r.name.includes("Tvůrce") ||
    r.name.includes("Doktor") ||
    r.name.includes("Majitel")
  );

  // ===== Ověření
  const overeni = await cat("👋 Ověření");
  const v = await text("👋│vitej", overeni);
  const p = await text("📜│pravidla", overeni);
  const o = await text("✅│overeni", overeni);

  await lock(v);
  await lock(p);
  await lock(o);

  // ===== Informace
  const info = await cat("📢 Informace");
  const oz = await text("📢│oznámení", info);
  const hlas = await text("🌐│hlasovaci-stranky", info);
  const dyn = await text("🗺│dynmapa", info);

  await text("🧭│jak-se-pripojit", info);
  await text("📱│socialni-site", info);

  await lock(oz);
  await lock(hlas);
  await lock(dyn);

  // ===== Statistiky
  const stats = await cat("📊 Statistiky");
  const s = await text("📡│server-status", stats);
  await text("👥│hraci-online", stats);
  await lock(s);

  // ===== Komunita
  const kom = await cat("💬 Komunita");
  await text("💬│pokec", kom);
  await text("📷│fotky", kom);
  await text("💡│napady", kom);
  await text("🏗│stavby", kom);
  await text("🗳│hlasovani", kom);

  // ===== Minecraft
  const mc = await cat("⛏ Minecraft");
  await text("⛏│mc-chat", mc);
  await text("📜│commandy", mc);
  await text("🦠│nemoci", mc);
  await text("🏠│home", mc);
  await text("🏡│residence", mc);

  // ===== Voice
  const vc = await cat("🎤 HLASOVÉ KANÁLY");
  await voice("🔊│Hlas 1", vc);
  await voice("🔊│Hlas 2", vc);
  await voice("🔊│Hlas 3", vc);
  await voice("🎵│Hudba", vc);
  await voice("🌙│AFK", vc);

  // ===== VIP (SPRÁVNĚ!)
  const vipCat = await cat("💎 VIP");

  await vipCat.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });

  if (vip) {
    await vipCat.permissionOverwrites.edit(vip, { ViewChannel: true });
  }

  await text("💬│vipchat", vipCat);

  const vipVoice = await cat("🎤 HLASOVÉ KANÁLY VIP");

  await vipVoice.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });

  if (vip) {
    await vipVoice.permissionOverwrites.edit(vip, { ViewChannel: true });
  }

  await voice("🔊│Hlas 1", vipVoice);
  await voice("🔊│Hlas 2", vipVoice);
  await voice("🔊│Hlas 3", vipVoice);
  await voice("🎵│Hudba", vipVoice);

  // ===== Podpora
  const pod = await cat("🎫 Podpora");
  await text("🎫│podpora", pod);
  await text("📋│nabory", pod);

  // ===== A-TEAM (SPRÁVNĚ!)
  const team = await cat("🛡 A-TEAM");

  await team.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });

  for (const r of atRoles.values()) {
    await team.permissionOverwrites.edit(r, { ViewChannel: true });
  }

  const ban = await text("🚨│banovaci-system", team);
  await text("🛠│admin-navod", team);
  await text("📜│admin-pravidla", team);
  await text("💬│admin-chat", team);
  await text("🛡│AT porada", team);
  await text("⚙│technicka-mistnost", team);
  await text("🎉│event-tym", team);
  await text("🏗│stavitele", team);
  await text("🤖│bot-prikazy", team);

  await lock(ban);

  // ===== AT VOICE
  const teamVoice = await cat("🎤 HLASOVÉ KANÁLY AT");

  await teamVoice.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });

  for (const r of atRoles.values()) {
    await teamVoice.permissionOverwrites.edit(r, { ViewChannel: true });
  }

  await voice("🔊│Hlas 1", teamVoice);
  await voice("🔊│Hlas 2", teamVoice);
  await voice("🎵│Hudba", teamVoice);
  await voice("🛡│AT porada", teamVoice);
  await voice("⚙│Technická místnost", teamVoice);
  await voice("🎉│Event tým", teamVoice);
  await voice("🏗│Stavitelé", teamVoice);

  // ===== LOGY
  const logy = await cat("📜 LOGY");

  await logy.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });

  const l1 = await text("📜│log-zprávy", logy);
  const l2 = await text("🔨│log-moderace", logy);
  const l3 = await text("👤│log-členové", logy);
  const l4 = await text("⚙│log-server", logy);

  await lock(l1);
  await lock(l2);
  await lock(l3);
  await lock(l4);

  // ===== SOUKROMÝ
  const priv = await cat("🌸 SOUKROMÝ");

  await priv.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });
  await priv.permissionOverwrites.edit(message.author.id, { ViewChannel: true });

  await text("🌸│majitelka-navod", priv);

  await message.channel.send("✅ HOTOVO – TEĎ JE TO SPRÁVNĚ");
});

client.login(process.env.TOKEN);
