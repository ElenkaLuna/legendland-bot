const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';

client.once('ready', () => {
  console.log(`Bot je online jako ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const command = message.content.slice(PREFIX.length).trim().toLowerCase();

  if (command === 'setup') {

    const guild = message.guild;

    await message.channel.send('⚙ Vytvářím finální LegendLand server...');

    // SMAZAT KANÁLY
    for (const c of guild.channels.cache.values()) {
      await c.delete().catch(() => {});
    }

    // SMAZAT ROLE
    for (const r of guild.roles.cache.values()) {
      if (r.name !== "@everyone" && !r.managed) {
        await r.delete().catch(() => {});
      }
    }

    // ROLE + BARVY
    const roles = [
      ["🌸 Majitelka DC", "#ff69b4"],
      ["👑 Majitel", "#ff0000"],
      ["🔧 Technik", "#555555"],
      ["🔧 Technička", "#555555"],
      ["🛡 Hlavní admin", "#8B0000"],
      ["🛡 Hlavní adminka", "#8B0000"],
      ["⚔ Admin", "#ff4500"],
      ["⚔ Adminka", "#ff4500"],
      ["⭐ Helper+", "#ffa500"],
      ["⭐ Helperka+", "#ffa500"],
      ["🛟 Helper", "#ffff00"],
      ["🛟 Helperka", "#ffff00"],
      ["🏗 Hlavní stavitel", "#8b4513"],
      ["🏗 Hlavní stavitelka", "#8b4513"],
      ["🧱 Stavitel", "#cd853f"],
      ["🧱 Stavitelka", "#cd853f"],
      ["🎉 Eventer", "#800080"],
      ["🎉 Eventerka", "#800080"],
      ["📢 Tvůrce obsahu", "#1e90ff"],
      ["📢 Tvůrkyně obsahu", "#1e90ff"],
      ["🩺 Doktor", "#00ff00"],
      ["🩺 Doktorka", "#00ff00"],
      ["💎 VIP", "#00ffff"],
      ["💠 VIP+", "#00bfff"],
      ["👑 VIP++", "#1e90ff"],
      ["✨ Legend VIP", "#9400d3"],
      ["🎮 Hráč", "#00ff00"]
    ];

    const created = {};

    for (const [name, color] of roles) {
      created[name] = await guild.roles.create({
        name,
        color
      });
    }

    // A-TEAM role
    const staff = [
      "🔧 Technik","🔧 Technička",
      "🛡 Hlavní admin","🛡 Hlavní adminka",
      "⚔ Admin","⚔ Adminka",
      "⭐ Helper+","⭐ Helperka+",
      "🛟 Helper","🛟 Helperka",
      "🏗 Hlavní stavitel","🏗 Hlavní stavitelka",
      "🧱 Stavitel","🧱 Stavitelka",
      "🎉 Eventer","🎉 Eventerka",
      "📢 Tvůrce obsahu","📢 Tvůrkyně obsahu",
      "🩺 Doktor","🩺 Doktorka"
    ];

    // FUNKCE KATEGORIE
    const createCat = async (name, channels, visibleRoles) => {

      const perms = [
        {
          id: guild.roles.everyone.id,
          deny: ['ViewChannel']
        }
      ];

      for (const r of visibleRoles) {
        perms.push({
          id: created[r].id,
          allow: ['ViewChannel']
        });
      }

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
    };

    // VEŘEJNÉ
    await createCat("💬 Komunita", [
      "💬│pokec",
      "📷│fotky",
      "💡│napady"
    ], roles.map(r => r[0]));

    // A-TEAM (SKRYTÝ)
    await createCat("🛡 A-TEAM", [
      "💬│admin-chat",
      "🛠│admin-navod",
      "🚨│banovaci-system"
    ], ["🌸 Majitelka DC","👑 Majitel", ...staff]);

    // VOICE
    const voice = await guild.channels.create({ name:"🎤 Hlasové", type:4 });

    await guild.channels.create({ name:"🔊 Hlas 1", type:2, parent:voice.id });
    await guild.channels.create({ name:"🔊 Hlas 2", type:2, parent:voice.id });
    await guild.channels.create({ name:"🔊 Hlas 3", type:2, parent:voice.id });
    await guild.channels.create({ name:"🎵 Hudba", type:2, parent:voice.id });
    await guild.channels.create({ name:"🌙 AFK", type:2, parent:voice.id });

    await message.channel.send("✅ HOTOVO – server nastaven.");
  }
});

client.login(process.env.TOKEN);
