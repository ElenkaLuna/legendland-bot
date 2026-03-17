const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`Bot běží jako ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  if (message.content === '!setup') {

    const guild = message.guild;
    const member = message.member;

    await message.channel.send('⚙ Vytvářím kompletní LegendLand...');

    // SMAZAT KANÁLY
    for (const c of guild.channels.cache.values()) {
      await c.delete().catch(()=>{});
    }

    // SMAZAT ROLE
    for (const r of guild.roles.cache.values()) {
      if (r.name !== "@everyone" && !r.managed) {
        await r.delete().catch(()=>{});
      }
    }

    // ROLE
    const roleData = [
      ["🌸 Majitelka DC", "#ff69b4"],
      ["👑 Majitel", "#ff0000"],
      ["🔧 Technik", "#555555"], ["🔧 Technička", "#555555"],
      ["🛡 Hlavní admin", "#8B0000"], ["🛡 Hlavní adminka", "#8B0000"],
      ["⚔ Admin", "#ff4500"], ["⚔ Adminka", "#ff4500"],
      ["⭐ Helper+", "#ffa500"], ["⭐ Helperka+", "#ffa500"],
      ["🛟 Helper", "#ffff00"], ["🛟 Helperka", "#ffff00"],
      ["🏗 Hlavní stavitel", "#8b4513"], ["🏗 Hlavní stavitelka", "#8b4513"],
      ["🧱 Stavitel", "#cd853f"], ["🧱 Stavitelka", "#cd853f"],
      ["🎉 Eventer", "#800080"], ["🎉 Eventerka", "#800080"],
      ["📢 Tvůrce obsahu", "#1e90ff"], ["📢 Tvůrkyně obsahu", "#1e90ff"],
      ["🩺 Doktor", "#00ff00"], ["🩺 Doktorka", "#00ff00"],
      ["💎 VIP", "#00ffff"], ["💠 VIP+", "#00bfff"], ["👑 VIP++", "#1e90ff"], ["✨ Legend VIP", "#9400d3"],
      ["🎮 Hráč", "#00ff00"],
      ["@Staff", "#ffffff"]
    ];

    const roles = {};
    for (const [name, color] of roleData) {
      roles[name] = await guild.roles.create({ name, color });
    }

    // DÁ TI MAJITELKU
    await member.roles.add(roles["🌸 Majitelka DC"]);

    // FUNKCE
    const everyone = guild.roles.everyone;

    const createCategory = async (name, channels, perms = []) => {
      const cat = await guild.channels.create({
        name,
        type: 4,
        permissionOverwrites: perms
      });

      for (const ch of channels) {
        await guild.channels.create({
          name: ch,
          type: 0,
          parent: cat.id
        });
      }
      return cat;
    };

    // Ověření (jen 3 kanály)
    await createCategory("👋 Ověření", [
      "👋│vitej",
      "📜│pravidla",
      "✅│overeni"
    ]);

    // Informace
    await createCategory("📢 Informace", [
      "📢│oznámení",
      "🌐│hlasovaci-stranky",
      "🎁│odmeny",
      "📡│server-status"
    ]);

    // Komunita
    await createCategory("💬 Komunita", [
      "💬│pokec",
      "📷│fotky",
      "💡│napady"
    ]);

    // Minecraft
    await createCategory("⛏ Minecraft", [
      "🎮│jak-na-server",
      "💬│minecraft-chat",
      "📢│minecraft-udalosti",
      "🗺│dynmapa"
    ]);

    // Návody
    await createCategory("📚 Návody", [
      "📚│navody",
      "📚│hudba-navod"
    ]);

    // VIP (SKRYTÉ)
    await createCategory("💎 VIP", [
      "💎│vip-chat",
      "🎁│vip-vyhody"
    ], [
      { id: everyone.id, deny: ['ViewChannel'] },
      { id: roles["💎 VIP"].id, allow: ['ViewChannel'] },
      { id: roles["@Staff"].id, allow: ['ViewChannel'] }
    ]);

    // A-TEAM (SKRYTÉ)
    await createCategory("🛡 A-TEAM", [
      "💬│admin-chat",
      "🛠│admin-navod",
      "🚨│banovaci-system"
    ], [
      { id: everyone.id, deny: ['ViewChannel'] },
      { id: roles["@Staff"].id, allow: ['ViewChannel'] },
      { id: roles["🌸 Majitelka DC"].id, allow: ['ViewChannel'] }
    ]);

    // LOGY (SKRYTÉ)
    await createCategory("📜 LOGY", [
      "📜│log-zpravy",
      "🔨│log-moderace"
    ], [
      { id: everyone.id, deny: ['ViewChannel'] },
      { id: roles["@Staff"].id, allow: ['ViewChannel'] }
    ]);

    // VOICE
    const voice = await guild.channels.create({ name:"🎤 Hlasové", type:4 });

    const voices = ["🔊 Hlas 1","🔊 Hlas 2","🔊 Hlas 3","🎵 Hudba","🌙 AFK"];
    for (const v of voices) {
      await guild.channels.create({ name:v, type:2, parent:voice.id });
    }

    // EMBED PRAVIDLA
    const rulesChannel = guild.channels.cache.find(c => c.name === "📜│pravidla");

    const embed = new EmbedBuilder()
      .setTitle("📜 Pravidla LegendLand")
      .setDescription("Dodržuj pravidla serveru. Respektuj ostatní hráče.")
      .setColor("#ff69b4");

    if (rulesChannel) rulesChannel.send({ embeds: [embed] });

    await message.channel.send("✅ SERVER JE HOTOVÝ.");
  }
});

client.login(process.env.TOKEN);
