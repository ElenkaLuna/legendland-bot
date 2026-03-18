const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ===== HELPER
const getRole = (g, name) => g.roles.cache.find(r => r.name === name);

async function role(g, name) {
  let r = getRole(g, name);
  if (!r) r = await g.roles.create({ name });
  return r;
}

async function cat(g, name) {
  return await g.channels.create({ name, type: ChannelType.GuildCategory });
}

async function text(g, name, parent) {
  return await g.channels.create({ name, type: ChannelType.GuildText, parent });
}

async function voice(g, name, parent) {
  return await g.channels.create({ name, type: ChannelType.GuildVoice, parent });
}

// ===== SETUP
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content !== "!setup") return;

  const g = msg.guild;
  const everyone = g.roles.everyone;

  await msg.reply("🔥 Čistím a stavím server...");

  // ===== SMAZAT KANÁLY
  for (const ch of g.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  // ===== ROLE
  const majitelka = await role(g, "🌸 Majitelka DC");
  const majitel = await role(g, "👑 Majitel");

  const technik = await role(g, "🔧 Technik");
  const technicka = await role(g, "🔧 Technička");

  const eventer = await role(g, "🎉 Eventer");
  const eventerka = await role(g, "🎉 Eventerka");

  const stavitel = await role(g, "🧱 Stavitel");
  const stavitelka = await role(g, "🧱 Stavitelka");
  const hlavniStavitel = await role(g, "🏗 Hlavní stavitel");
  const hlavniStavitelka = await role(g, "🏗 Hlavní stavitelka");

  const vip = await role(g, "💎 VIP");
  await role(g, "🎮 Hráč");
  await role(g, "@Staff");

  // ===== Ověření
  const overeni = await cat(g, "👋 Ověření");
  const vitej = await text(g, "👋│vitej", overeni);
  await text(g, "📜│pravidla", overeni);
  await text(g, "✅│overeni", overeni);

  await vitej.permissionOverwrites.set([
    { id: everyone.id, deny: ["SendMessages"] },
    { id: majitelka.id, allow: ["SendMessages"] }
  ]);

  // ===== Informace
  const info = await cat(g, "📢 Informace");
  await text(g, "📢│oznámení", info);
  await text(g, "🧭│jak-se-pripojit", info);
  await text(g, "🌐│hlasovaci-stranky", info);
  await text(g, "🗺│dynmapa", info);
  await text(g, "📱│socialni-site", info);

  // ===== Statistiky
  const stats = await cat(g, "📊 Statistiky");
  await text(g, "📡│server-status", stats);
  await voice(g, "👥 hráči-online", stats);

  // ===== Komunita
  const kom = await cat(g, "💬 Komunita");
  await text(g, "💬│pokec", kom);
  await text(g, "📷│fotky", kom);
  await text(g, "💡│napady", kom);
  await text(g, "🏗│stavby", kom);
  await text(g, "🗳│hlasovani", kom);

  // ===== Minecraft
  const mc = await cat(g, "⛏ Minecraft");
  await text(g, "⛏│mc-chat", mc);
  await text(g, "📜│commandy", mc);
  await text(g, "🦠│nemoci", mc);
  await text(g, "🏠│home", mc);
  await text(g, "🏡│residence", mc);

  // ===== VOICE HLAVNÍ
  const voiceMain = await cat(g, "🎤 HLASOVÉ KANÁLY");
  await voice(g, "🔊│Hlas 1", voiceMain);
  await voice(g, "🔊│Hlas 2", voiceMain);
  await voice(g, "🔊│Hlas 3", voiceMain);
  await voice(g, "🎵│Hudba", voiceMain);
  await voice(g, "🌙│AFK", voiceMain);

  // ===== VIP
  const vipCat = await cat(g, "💎 VIP");
  await text(g, "💬│vipchat", vipCat);

  const vipVoice = await cat(g, "🎤 HLASOVÉ KANÁLY VIP");
  await voice(g, "🔊│Hlas 1", vipVoice);
  await voice(g, "🔊│Hlas 2", vipVoice);
  await voice(g, "🔊│Hlas 3", vipVoice);
  await voice(g, "🎵│Hudba", vipVoice);

  await vipCat.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: vip.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);

  // ===== PODPORA
  const pod = await cat(g, "🎫 Podpora");
  await text(g, "🎫│podpora", pod);
  await text(g, "📋│nabory", pod);

  // ===== A-TEAM TEXT
  const team = await cat(g, "🛡 A-TEAM");
  const tech = await text(g, "⚙│technicka-mistnost", team);
  const event = await text(g, "🎉│event-tym", team);
  const stav = await text(g, "🏗│stavitele", team);

  await text(g, "🛠│admin-navod", team);
  await text(g, "📜│admin-pravidla", team);
  await text(g, "🚨│banovaci-system", team);
  await text(g, "💬│admin-chat", team);
  await text(g, "🛡│AT porada", team);
  await text(g, "🤖│bot-prikazy", team);

  // ===== A-TEAM VOICE (SPRÁVNĚ!)
  const teamVoice = await cat(g, "🎤 HLASOVÉ KANÁLY AT");

  await voice(g, "🔊│Hlas 1", teamVoice);
  await voice(g, "🔊│Hlas 2", teamVoice);
  await voice(g, "🎵│Hudba", teamVoice);
  await voice(g, "🛡│AT porada", teamVoice);
  await voice(g, "⚙│Technická místnost", teamVoice);
  await voice(g, "🎉│Event tým", teamVoice);
  await voice(g, "🏗│Stavitelé", teamVoice);

  // ===== PERMISSIONS
  const lockTo = async (ch, roles) => {
    await ch.permissionOverwrites.set([
      { id: everyone.id, deny: ["ViewChannel"] },
      ...roles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
    ]);
  };

  await lockTo(tech, [technik, technicka, majitel, majitelka]);
  await lockTo(event, [eventer, eventerka, majitel, majitelka]);
  await lockTo(stav, [stavitel, stavitelka, hlavniStavitel, hlavniStavitelka, majitel, majitelka]);

  // ===== LOGY
  const logy = await cat(g, "📜 LOGY");
  await text(g, "📜│log-zprávy", logy);
  await text(g, "🔨│log-moderace", logy);
  await text(g, "👤│log-členové", logy);
  await text(g, "⚙│log-server", logy);

  await logy.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] }
  ]);

  // ===== SOUKROMÝ
  const priv = await cat(g, "🌸 SOUKROMÝ");
  const maj = await text(g, "🌸│majitelka-navod", priv);

  await maj.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);

  await msg.reply("✅ HOTOVO – TEĎ JE TO SPRÁVNĚ");
});

client.login(process.env.TOKEN);
