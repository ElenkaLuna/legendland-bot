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

// ===== HELPER
const getRole = (guild, name) => guild.roles.cache.find(r => r.name === name);
const getChannel = (guild, name) => guild.channels.cache.find(c => c.name === name);

async function createRoleIfNot(guild, name) {
  let role = getRole(guild, name);
  if (!role) role = await guild.roles.create({ name });
  return role;
}

async function createChannelIfNot(guild, name, type, parent = null) {
  let ch = getChannel(guild, name);
  if (!ch) {
    ch = await guild.channels.create({
      name,
      type,
      parent: parent?.id
    });
  }
  return ch;
}

// ===== SETUP (SAFE)
client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.reply("⚙️ Opravuji server (nic nemažu)...");

  // ===== ROLE (jen pokud chybí)
  const majitelka = await createRoleIfNot(guild, "🌸 Majitelka DC");
  const majitel = await createRoleIfNot(guild, "👑 Majitel");

  const technik = await createRoleIfNot(guild, "🔧 Technik");
  const technicka = await createRoleIfNot(guild, "🔧 Technička");

  const eventer = await createRoleIfNot(guild, "🎉 Eventer");
  const eventerka = await createRoleIfNot(guild, "🎉 Eventerka");

  const stavitel = await createRoleIfNot(guild, "🧱 Stavitel");
  const stavitelka = await createRoleIfNot(guild, "🧱 Stavitelka");

  const hlavniStavitel = await createRoleIfNot(guild, "🏗 Hlavní stavitel");
  const hlavniStavitelka = await createRoleIfNot(guild, "🏗 Hlavní stavitelka");

  const vip = await createRoleIfNot(guild, "💎 VIP");
  const hrac = await createRoleIfNot(guild, "🎮 Hráč");

  // STAFF ROLE
  let staff = getRole(guild, "@Staff");
  if (!staff) {
    staff = await guild.roles.create({
      name: "@Staff",
      mentionable: false
    });
  }

  const everyone = guild.roles.everyone;

  // ===== KATEGORIE
  const teamCat = await createChannelIfNot(guild, "🛡 A-TEAM", 4);
  const vipCat = await createChannelIfNot(guild, "💎 VIP", 4);

  // ===== STAVITELÉ (FIX)
  const stavCh = await createChannelIfNot(guild, "🏗│stavitele", 0, teamCat);
  const stavVoice = await createChannelIfNot(guild, "🏗│Stavitelé", 2, teamCat);

  await stavCh.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: stavitel.id, allow: ["ViewChannel"] },
    { id: stavitelka.id, allow: ["ViewChannel"] },
    { id: hlavniStavitel.id, allow: ["ViewChannel"] },
    { id: hlavniStavitelka.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);
  await ensureFullStructure(guild);

  await stavVoice.permissionOverwrites.set(stavCh.permissionOverwrites.cache.map(p => p));

  // ===== EVENT
  const eventCh = await createChannelIfNot(guild, "🎉│event-tym", 0, teamCat);

  await eventCh.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: eventer.id, allow: ["ViewChannel"] },
    { id: eventerka.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);

  // ===== TECH
  const techCh = await createChannelIfNot(guild, "⚙│technicka-mistnost", 0, teamCat);

  await techCh.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: technik.id, allow: ["ViewChannel"] },
    { id: technicka.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] }
  ]);

  // ===== VIP FIX
  await vipCat.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: vip.id, allow: ["ViewChannel"] },
    { id: majitel.id, allow: ["ViewChannel"] },
    { id: majitelka.id, allow: ["ViewChannel"] },
    { id: staff.id, allow: ["ViewChannel"] }
  ]);

  await createChannelIfNot(guild, "💬│vipchat", 0, vipCat);

  await message.reply("✅ HOTOVO – NIC SE NESMAZALO");
});

// ===== VERIFY
client.on('messageCreate', async message => {
  if (message.content === "!verify") {
    const role = getRole(message.guild, "🎮 Hráč");
    if (!role) return;

    await message.member.roles.add(role);
    message.reply("✅ Ověřen!");
  }
});

// ===== TICKET
client.on('messageCreate', async message => {
  if (message.content === "!ticket") {

    const ch = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText
    });

    await ch.send("🎫 Ticket vytvořen");
  }
});
// ===== DOPLNĚNÍ VŠECH KANÁLŮ
async function ensureFullStructure(guild) {

  const everyone = guild.roles.everyone;

  const getRole = name => guild.roles.cache.find(r => r.name === name);

  const majitelka = getRole("🌸 Majitelka DC");
  const majitel = getRole("👑 Majitel");

  const technik = getRole("🔧 Technik");
  const technicka = getRole("🔧 Technička");

  const eventer = getRole("🎉 Eventer");
  const eventerka = getRole("🎉 Eventerka");

  const stavitel = getRole("🧱 Stavitel");
  const stavitelka = getRole("🧱 Stavitelka");
  const hlavniStavitel = getRole("🏗 Hlavní stavitel");
  const hlavniStavitelka = getRole("🏗 Hlavní stavitelka");

  const vip = getRole("💎 VIP");

  const getOrCreate = async (name, type, parent) => {
    let ch = guild.channels.cache.find(c => c.name === name);
    if (!ch) {
      ch = await guild.channels.create({
        name,
        type,
        parent: parent?.id
      });
    }
    return ch;
  };

  // ===== KATEGORIE
  const team = await getOrCreate("🛡 A-TEAM", 4);
  const logy = await getOrCreate("📜 LOGY", 4);

  // ===== A-TEAM TEXT
  const adminNavod = await getOrCreate("🛠│admin-navod", 0, team);
  const adminPravidla = await getOrCreate("📜│admin-pravidla", 0, team);
  const ban = await getOrCreate("🚨│banovaci-system", 0, team);
  const adminChat = await getOrCreate("💬│admin-chat", 0, team);
  const porada = await getOrCreate("🛡│AT porada", 0, team);
  const tech = await getOrCreate("⚙│technicka-mistnost", 0, team);
  const event = await getOrCreate("🎉│event-tym", 0, team);
  const stav = await getOrCreate("🏗│stavitele", 0, team);
  const botCmd = await getOrCreate("🤖│bot-prikazy", 0, team);

  // ===== A-TEAM VOICE
  await getOrCreate("🔊│Hlas 1", 2, team);
  await getOrCreate("🔊│Hlas 2", 2, team);
  await getOrCreate("🎵│Hudba", 2, team);
  await getOrCreate("🛡│AT porada", 2, team);
  await getOrCreate("⚙│Technická místnost", 2, team);
  await getOrCreate("🎉│Event tým", 2, team);
  await getOrCreate("🏗│Stavitelé", 2, team);

  // ===== LOGY
  await getOrCreate("📜│log-zprávy", 0, logy);
  await getOrCreate("🔨│log-moderace", 0, logy);
  await getOrCreate("👤│log-členové", 0, logy);
  await getOrCreate("⚙│log-server", 0, logy);

  // ===== PERMISSIONS (KLÍČOVÉ)
  const staffRoles = [
    majitelka, majitel,
    technik, technicka,
    eventer, eventerka,
    stavitel, stavitelka,
    hlavniStavitel, hlavniStavitelka
  ].filter(Boolean);

  const allowStaff = staffRoles.map(r => ({
    id: r.id,
    allow: ["ViewChannel"]
  }));

  // A-TEAM vidí jen staff
  await team.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    ...allowStaff
  ]);

  // LOGY nevidí hráči
  await logy.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: majitelka?.id, allow: ["ViewChannel"] },
    { id: majitel?.id, allow: ["ViewChannel"] }
  ]);

  // TECH pouze technici
  await tech.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: technik?.id, allow: ["ViewChannel"] },
    { id: technicka?.id, allow: ["ViewChannel"] },
    { id: majitel?.id, allow: ["ViewChannel"] },
    { id: majitelka?.id, allow: ["ViewChannel"] }
  ]);

  // EVENT pouze event
  await event.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: eventer?.id, allow: ["ViewChannel"] },
    { id: eventerka?.id, allow: ["ViewChannel"] },
    { id: majitel?.id, allow: ["ViewChannel"] },
    { id: majitelka?.id, allow: ["ViewChannel"] }
  ]);

  // STAVITELÉ fix
  await stav.permissionOverwrites.set([
    { id: everyone.id, deny: ["ViewChannel"] },
    { id: stavitel?.id, allow: ["ViewChannel"] },
    { id: stavitelka?.id, allow: ["ViewChannel"] },
    { id: hlavniStavitel?.id, allow: ["ViewChannel"] },
    { id: hlavniStavitelka?.id, allow: ["ViewChannel"] },
    { id: majitel?.id, allow: ["ViewChannel"] },
    { id: majitelka?.id, allow: ["ViewChannel"] }
  ]);

}
client.login(process.env.TOKEN);
