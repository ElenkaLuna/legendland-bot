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

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("🔥 Nastavuji FINÁLNÍ LegendLand...");

  // SMAZAT VŠE
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  // ROLE
  const createRole = async name => guild.roles.create({ name });

  const majitelka = await createRole("🌸 Majitelka DC");
  const majitel = await createRole("👑 Majitel");

  const technik = await createRole("🔧 Technik");
  const technicka = await createRole("🔧 Technička");

  const admin = await createRole("⚔ Admin");
  const helper = await createRole("🛟 Helper");

  const eventer = await createRole("🎉 Eventer");
  const stavitel = await createRole("🧱 Stavitel");

  const hrac = await createRole("🎮 Hráč");

  const vip = await createRole("💎 VIP");

  const botRole = await createRole("🤖 Bot");

  // STAFF ROLE
  const staff = await guild.roles.create({
    name: "@Staff",
    mentionable: false
  });

  // ===== KANÁLY
  const cat = async name => guild.channels.create({ name, type: 4 });
  const text = async (name, parent) => guild.channels.create({ name, type: 0, parent: parent.id });
  const voice = async (name, parent) => guild.channels.create({ name, type: 2, parent: parent.id });

  const lock = async ch => {
    await ch.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
  };

  const hide = async ch => {
    await ch.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false });
  };

  // 👋 Ověření
  const overeni = await cat("👋 Ověření");
  const vitej = await text("👋│vitej", overeni);
  const pravidla = await text("📜│pravidla", overeni);
  const over = await text("✅│overeni", overeni);

  await lock(vitej);
  await lock(pravidla);

  // 📢 Informace
  const info = await cat("📢 Informace");
  const oz = await text("📢│oznámení", info);
  const hlas = await text("🌐│hlasovaci-stranky", info);
  const dyn = await text("🗺│dynmapa", info);

  await lock(oz);
  await lock(hlas);
  await lock(dyn);

  // 📊 Statistiky
  const stats = await cat("📊 Statistiky");
  const status = await text("📡│server-status", stats);
  await lock(status);

  // 💬 Komunita
  const kom = await cat("💬 Komunita");
  await text("💬│pokec", kom);

  // 🎤 Voice
  const vc = await cat("🎤 HLASOVÉ KANÁLY");
  await voice("🔊│Hlas 1", vc);

  // 💎 VIP
  const vipCat = await cat("💎 VIP");
  await hide(vipCat);
  await vipCat.permissionOverwrites.edit(vip, { ViewChannel: true });
  await vipCat.permissionOverwrites.edit(majitel, { ViewChannel: true });
  await vipCat.permissionOverwrites.edit(majitelka, { ViewChannel: true });

  await text("💬│vipchat", vipCat);

  // 🎫 Podpora
  const pod = await cat("🎫 Podpora");
  const podCh = await text("🎫│podpora", pod);

  // 🛡 A-TEAM
  const team = await cat("🛡 A-TEAM");
  await hide(team);

  const techCh = await text("⚙│technicka-mistnost", team);
  const eventCh = await text("🎉│event-tym", team);
  const stavCh = await text("🏗│stavitele", team);

  // TECH
  await hide(techCh);
  await techCh.permissionOverwrites.edit(technik, { ViewChannel: true });
  await techCh.permissionOverwrites.edit(technicka, { ViewChannel: true });
  await techCh.permissionOverwrites.edit(majitel, { ViewChannel: true });
  await techCh.permissionOverwrites.edit(majitelka, { ViewChannel: true });

  // EVENT
  await hide(eventCh);
  await eventCh.permissionOverwrites.edit(eventer, { ViewChannel: true });
  await eventCh.permissionOverwrites.edit(majitel, { ViewChannel: true });
  await eventCh.permissionOverwrites.edit(majitelka, { ViewChannel: true });

  // STAVITEL
  await hide(stavCh);
  await stavCh.permissionOverwrites.edit(stavitel, { ViewChannel: true });
  await stavCh.permissionOverwrites.edit(majitel, { ViewChannel: true });
  await stavCh.permissionOverwrites.edit(majitelka, { ViewChannel: true });

  // 📜 LOGY
  const logy = await cat("📜 LOGY");
  await hide(logy);

  const log1 = await text("📜│log-zprávy", logy);
  await lock(log1);

  // 🌸 SOUKROMÝ
  const priv = await cat("🌸 SOUKROMÝ");
  await hide(priv);
  await priv.permissionOverwrites.edit(message.author.id, { ViewChannel: true });

  await text("🌸│majitelka-navod", priv);

  // ===== TEXTY
  await vitej.send("👋 Vítej na LegendLand!");
  await pravidla.send("📜 Dodržuj pravidla.");

  await podCh.send("🎫 Napiš !ticket pro vytvoření ticketu");

  await message.channel.send("✅ HOTOVO – FINÁLNÍ VERZE");
});

// VERIFY
client.on('messageCreate', async message => {
  if (message.content === "!verify") {
    const role = message.guild.roles.cache.find(r => r.name.includes("Hráč"));
    if (!role) return;

    await message.member.roles.add(role);
    message.reply("✅ Ověřen!");
  }
});

// TICKET
client.on('messageCreate', async message => {
  if (message.content === "!ticket") {

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: ChannelType.GuildText
    });

    await channel.send("🎫 Ticket vytvořen");
  }
});
client.on('messageCreate', async message => {

  if (message.content !== "!fix") return;

  const guild = message.guild;

  const get = name => guild.roles.cache.find(r => r.name === name);

  const majitelka = get("🌸 Majitelka DC");
  const majitel = get("👑 Majitel");

  const technik = get("🔧 Technik");
  const technicka = get("🔧 Technička");

  const eventer = get("🎉 Eventer");
  const eventerka = get("🎉 Eventerka");

  const stavitel = get("🧱 Stavitel");
  const stavitelka = get("🧱 Stavitelka");

  const everyone = guild.roles.everyone;

  let staff = get("@Staff");
  if (!staff) {
    staff = await guild.roles.create({
      name: "@Staff",
      mentionable: false
    });
  }

  const techCh = guild.channels.cache.find(c => c.name.includes("technicka"));
  const eventCh = guild.channels.cache.find(c => c.name.includes("event"));
  const stavCh = guild.channels.cache.find(c => c.name.includes("stavitele"));

  const set = async (ch, roles) => {
    if (!ch) return;

    await ch.permissionOverwrites.set([
      { id: everyone.id, deny: ["ViewChannel"] },
      ...roles.map(r => ({ id: r.id, allow: ["ViewChannel"] }))
    ]);
  };

  await set(techCh, [technik, technicka, majitel, majitelka]);
  await set(eventCh, [eventer, eventerka, majitel, majitelka]);
  await set(stavCh, [stavitel, stavitelka, majitel, majitelka]);

  message.reply("✅ FIX hotový");
});

client.login(process.env.TOKEN);
