const {
  Client,
  GatewayIntentBits,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ===== HELPERS
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

  await msg.reply("🔥 Stavím server...");

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
  const vipPlus = await role(g, "💠 VIP+");
  const vipPlusPlus = await role(g, "👑 VIP++");
  const vipLegend = await role(g, "✨ Legend VIP");

  // DALŠÍ ROLE
  const hlavniAdmin = await role(g, "🛡 Hlavní admin");
  const hlavniAdminka = await role(g, "🛡 Hlavní adminka");
  const admin = await role(g, "⚔ Admin");
  const adminka = await role(g, "⚔ Adminka");

  const helperPlus = await role(g, "⭐ Helper+");
  const helperkaPlus = await role(g, "⭐ Helperka+");
  const helper = await role(g, "🛟 Helper");
  const helperka = await role(g, "🛟 Helperka");

  const tvurce = await role(g, "📢 Tvůrce obsahu");
  const tvurkyne = await role(g, "📢 Tvůrkyně obsahu");

  const doktor = await role(g, "🩺 Doktor");
  const doktorka = await role(g, "🩺 Doktorka");

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

  // ===== HLAVNÍ VOICE
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

  const vipRoles = [
    vip, vipPlus, vipPlusPlus, vipLegend,
    majitel, majitelka,
    technik, technicka,
    hlavniAdmin, hlavniAdminka, admin, adminka,
    helperPlus, helperkaPlus, helper, helperka,
    tvurce, tvurkyne,
    doktor, doktorka
  ];

  await vipCat.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    ...vipRoles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
  ]);

  await vipVoice.permissionOverwrites.set(vipCat.permissionOverwrites.cache.map(p => p));

  await voice(g, "🔊│Hlas 1", vipVoice);
  await voice(g, "🔊│Hlas 2", vipVoice);
  await voice(g, "🔊│Hlas 3", vipVoice);
  await voice(g, "🎵│Hudba", vipVoice);

  // ===== PODPORA
  const pod = await cat(g, "🎫 Podpora");
  await text(g, "🎫│podpora", pod);
  await text(g, "📋│nabory", pod);

  // ===== A-TEAM
  const team = await cat(g, "🛡 A-TEAM");

  const teamRoles = [
    majitel, majitelka,
    technik, technicka,
    eventer, eventerka,
    stavitel, stavitelka, hlavniStavitel, hlavniStavitelka,
    hlavniAdmin, hlavniAdminka, admin, adminka,
    helperPlus, helperkaPlus, helper, helperka,
    tvurce, tvurkyne,
    doktor, doktorka
  ];

  await team.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    ...teamRoles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
  ]);

  const tech = await text(g, "⚙│technicka-mistnost", team);
  const event = await text(g, "🎉│event-tym", team);
  const stav = await text(g, "🏗│stavitele", team);

  const setPerm = async (ch, roles) => {
    await ch.permissionOverwrites.set([
      { id: everyone.id, deny: ["ViewChannel"] },
      ...roles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
    ]);
  };

  await setPerm(tech, [technik, technicka, majitel, majitelka]);
  await setPerm(event, [eventer, eventerka, majitel, majitelka]);
  await setPerm(stav, [stavitel, stavitelka, hlavniStavitel, hlavniStavitelka, majitel, majitelka]);

  // ===== AT VOICE
  const teamVoice = await cat(g, "🎤 HLASOVÉ KANÁLY AT");

  const techV = await voice(g, "⚙│Technická místnost", teamVoice);
  const eventV = await voice(g, "🎉│Event tým", teamVoice);
  const stavV = await voice(g, "🏗│Stavitelé", teamVoice);

  await voice(g, "🔊│Hlas 1", teamVoice);
  await voice(g, "🔊│Hlas 2", teamVoice);
  await voice(g, "🎵│Hudba", teamVoice);
  await voice(g, "🛡│AT porada", teamVoice);

  await setPerm(techV, [technik, technicka, majitel, majitelka]);
  await setPerm(eventV, [eventer, eventerka, majitel, majitelka]);
  await setPerm(stavV, [stavitel, stavitelka, hlavniStavitel, hlavniStavitelka, majitel, majitelka]);

  await msg.reply("✅ HOTOVO – TEĎ JE TO KONEČNĚ SPRÁVNĚ");
});

client.login(process.env.TOKEN);
