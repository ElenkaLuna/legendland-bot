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

  // EXTRA ROLE
  const rolesExtra = [
    "🛡 Hlavní admin","🛡 Hlavní adminka","⚔ Admin","⚔ Adminka",
    "⭐ Helper+","⭐ Helperka+","🛟 Helper","🛟 Helperka",
    "📢 Tvůrce obsahu","📢 Tvůrkyně obsahu",
    "🩺 Doktor","🩺 Doktorka"
  ];

  for (const r of rolesExtra) await role(g, r);

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

  // ===== KOMUNITA
  const kom = await cat(g, "💬 Komunita");
  await text(g, "💬│pokec", kom);

  // ===== VOICE MAIN
  const voiceMain = await cat(g, "🎤 HLASOVÉ KANÁLY");
  await voice(g, "🔊│Hlas 1", voiceMain);
  await voice(g, "🔊│Hlas 2", voiceMain);
  await voice(g, "🔊│Hlas 3", voiceMain);
  await voice(g, "🎵│Hudba", voiceMain);

  // ===== VIP
  const vipCat = await cat(g, "💎 VIP");
  await text(g, "💬│vipchat", vipCat);

  const vipVoice = await cat(g, "🎤 HLASOVÉ KANÁLY VIP");

  await vipCat.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: vip.id, allow: ["ViewChannel"] },
    { id: vipPlus.id, allow: ["ViewChannel"] },
    { id: vipPlusPlus.id, allow: ["ViewChannel"] },
    { id: vipLegend.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);

  await vipVoice.permissionOverwrites.set(vipCat.permissionOverwrites.cache.map(p => p));

  await voice(g, "🔊│Hlas 1", vipVoice);
  await voice(g, "🔊│Hlas 2", vipVoice);

  // ===== PODPORA
  const pod = await cat(g, "🎫 Podpora");
  await text(g, "🎫│podpora", pod);
  await text(g, "📋│nabory", pod);

  // ===== A-TEAM (FIXED)
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

  const setPerm = async (ch, roles) => {
    await ch.permissionOverwrites.set([
      { id: everyone.id, deny: ["ViewChannel"] },
      ...roles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
    ]);
  };

  await setPerm(tech, [technik, technicka, majitel, majitelka]);
  await setPerm(event, [eventer, eventerka, majitel, majitelka]);
  await setPerm(stav, [stavitel, stavitelka, hlavniStavitel, hlavniStavitelka, majitel, majitelka]);

  // ===== AT VOICE (už funguje)
  const teamVoice = await cat(g, "🎤 HLASOVÉ KANÁLY AT");

  await voice(g, "⚙│Technická místnost", teamVoice);
  await voice(g, "🎉│Event tým", teamVoice);
  await voice(g, "🏗│Stavitelé", teamVoice);
  await voice(g, "🔊│Hlas 1", teamVoice);
  await voice(g, "🔊│Hlas 2", teamVoice);
  await voice(g, "🎵│Hudba", teamVoice);

  await msg.reply("✅ HOTOVO – FINÁLNÍ VERZE");
});

client.login(process.env.TOKEN);
