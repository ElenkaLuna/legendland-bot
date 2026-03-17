const { Client, GatewayIntentBits } = require('discord.js');
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

    await message.channel.send('⚙ Vytvářím FINÁLNÍ LegendLand server...');

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

    // ROLE
    const roleList = [
      "🌸 Majitelka DC","👑 Majitel",
      "🔧 Technik","🔧 Technička",
      "🛡 Hlavní admin","🛡 Hlavní adminka",
      "⚔ Admin","⚔ Adminka",
      "⭐ Helper+","⭐ Helperka+",
      "🛟 Helper","🛟 Helperka",
      "🏗 Hlavní stavitel","🏗 Hlavní stavitelka",
      "🧱 Stavitel","🧱 Stavitelka",
      "🎉 Eventer","🎉 Eventerka",
      "📢 Tvůrce obsahu","📢 Tvůrkyně obsahu",
      "🩺 Doktor","🩺 Doktorka",
      "💎 VIP","💠 VIP+","👑 VIP++","✨ Legend VIP",
      "🎮 Hráč","🏅 Aktivní","⭐ Zkušený","💠 Veterán","💎 Legenda"
    ];

    const roles = {};
    for (const name of roleList) {
      roles[name] = await guild.roles.create({ name });
    }

    const staffRoles = roleList.filter(r =>
      r.includes("Technik") ||
      r.includes("admin") ||
      r.includes("Admin") ||
      r.includes("Helper") ||
      r.includes("stavitel") ||
      r.includes("Event") ||
      r.includes("Tvůrce") ||
      r.includes("Doktor")
    );

    // FUNKCE KATEGORIE
    const createCategory = async (name, channels, visible = roleList) => {

      const perms = [
        {
          id: guild.roles.everyone.id,
          allow: ['ViewChannel']
        }
      ];

      const cat = await guild.channels.create({ name, type: 4 });

      for (const ch of channels) {
        await guild.channels.create({
          name: ch,
          type: 0,
          parent: cat.id
        });
      }
    };

    const createHiddenCategory = async (name, channels, allowedRoles) => {

      const perms = [
        {
          id: guild.roles.everyone.id,
          deny: ['ViewChannel']
        }
      ];

      for (const r of allowedRoles) {
        perms.push({
          id: roles[r].id,
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

    // KATEGORIE
    await createCategory("👋 Ověření", [
      "👋│vitej",
      "📜│pravidla",
      "✅│overeni"
    ]);

    await createCategory("📢 Informace", [
      "📢│oznámení",
      "🧭│jak-se-pripojit",
      "🌐│hlasovaci-stranky",
      "🗺│dynmapa",
      "📱│socialni-site"
    ]);

    await createCategory("📊 Statistiky", [
      "📡│server-status",
      "👥│hraci-online"
    ]);

    await createCategory("💬 Komunita", [
      "💬│pokec",
      "📷│fotky",
      "💡│napady",
      "🏗│stavby",
      "🗳│hlasovani"
    ]);

    await createCategory("⛏ Minecraft", [
      "⛏│mc-chat",
      "📜│commandy",
      "🦠│nemoci",
      "🏠│home",
      "🏡│residence"
    ]);

    await createCategory("📚 Návody", [
      "📚│navody",
      "📚│bot-navod",
      "📚│hudba",
      "📚│admin-navod"
    ]);

    await createCategory("🎫 Podpora", [
      "🎫│podpora",
      "📋│nabory"
    ]);

    await createCategory("💎 VIP", [
      "💬│vipchat",
      "🎁│vip-vyhody",
      "📢│vip-oznameni"
    ]);

    // A-TEAM (SKRYTÝ)
    await createHiddenCategory("🛡 A-TEAM", [
      "🛠│admin-navod",
      "📜│admin-pravidla",
      "🚨│banovaci-system",
      "💬│admin-chat",
      "🛡│AT porada",
      "⚙│technicka-mistnost",
      "🎉│event-tym",
      "🏗│stavitele",
      "🤖│bot-prikazy"
    ], ["🌸 Majitelka DC","👑 Majitel", ...staffRoles]);

    // LOGY (SKRYTÉ)
    await createHiddenCategory("📜 LOGY", [
      "📜│log-zpravy",
      "🔨│log-moderace",
      "👤│log-clenove",
      "⚙│log-server"
    ], ["🌸 Majitelka DC","👑 Majitel", ...staffRoles]);

    // VOICE
    const voice = await guild.channels.create({ name:"🎤 Hlasové", type:4 });

    const voices = ["🔊 Hlas 1","🔊 Hlas 2","🔊 Hlas 3","🎵 Hudba","🌙 AFK"];
    for (const v of voices) {
      await guild.channels.create({ name:v, type:2, parent:voice.id });
    }

    // AT VOICE
    const atVoice = await guild.channels.create({
      name:"🛡 AT Hlasové",
      type:4,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny:['ViewChannel'] },
        { id: roles["🌸 Majitelka DC"].id, allow:['ViewChannel'] },
        { id: roles["👑 Majitel"].id, allow:['ViewChannel'] }
      ]
    });

    const atVoices = [
      "🛡│AT porada",
      "⚙│Technická místnost",
      "🎉│Event tým",
      "🏗│Stavitelé"
    ];

    for (const v of atVoices) {
      await guild.channels.create({ name:v, type:2, parent:atVoice.id });
    }

    await message.channel.send("✅ FINÁLNÍ SERVER VYTVOŘEN.");
  }
});

client.login(process.env.TOKEN);
