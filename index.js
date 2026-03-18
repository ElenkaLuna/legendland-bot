const {
  Client,
  GatewayIntentBits,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
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

  await msg.reply("🔥 Čistím a stavím server...");

  // ===== SMAZAT KANÁLY
  for (const ch of g.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  // ===== ROLE (bez duplicit)
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
  const hrac = await role(g, "🎮 Hráč");

  const staff = await role(g, "@Staff");

  const everyone = g.roles.everyone;

  // ===== Ověření
  const overeni = await cat(g, "👋 Ověření");
  const vitej = await text(g, "👋│vitej", overeni);
  const pravidla = await text(g, "📜│pravidla", overeni);
  await text(g, "✅│overeni", overeni);

  // lock
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

  // ===== VOICE
  const voiceCat = await cat(g, "🎤 HLASOVÉ KANÁLY");
  await voice(g, "🔊│Hlas 1", voiceCat);
  await voice(g, "🔊│Hlas 2", voiceCat);
  await voice(g, "🔊│Hlas 3", voiceCat);
  await voice(g, "🎵│Hudba", voiceCat);
  await voice(g, "🌙│AFK", voiceCat);

  // ===== VIP
  const vipCat = await cat(g, "💎 VIP");
  const vipChat = await text(g, "💬│vipchat", vipCat);

  await vipCat.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: vip.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] },
    { id: staff.id, allow: ["ViewChannel"] }
  ]);

  // ===== PODPORA
  const pod = await cat(g, "🎫 Podpora");
  await text(g, "🎫│podpora", pod);
  await text(g, "📋│nabory", pod);

  // ===== A-TEAM
  const team = await cat(g, "🛡 A-TEAM");

  const adminNavod = await text(g, "🛠│admin-navod", team);
  const adminPravidla = await text(g, "📜│admin-pravidla", team);
  const ban = await text(g, "🚨│banovaci-system", team);
  await text(g, "💬│admin-chat", team);
  await text(g, "🛡│AT porada", team);

  const tech = await text(g, "⚙│technicka-mistnost", team);
  const event = await text(g, "🎉│event-tym", team);
  const stav = await text(g, "🏗│stavitele", team);
  await text(g, "🤖│bot-prikazy", team);

  // VOICE AT
  await voice(g, "🔊│Hlas 1", team);
  await voice(g, "🔊│Hlas 2", team);
  await voice(g, "🎵│Hudba", team);
  await voice(g, "🛡│AT porada", team);
  await voice(g, "⚙│Technická místnost", team);
  await voice(g, "🎉│Event tým", team);
  await voice(g, "🏗│Stavitelé", team);

  // ===== PERMISSIONS SPECIFICKÉ
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

  await msg.reply("✅ HOTOVO – SERVER JE ČISTÝ A SPRÁVNÝ");
});

client.login(process.env.TOKEN);
