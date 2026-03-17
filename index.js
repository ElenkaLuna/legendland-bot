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

  if (command === 'ping') {
    return message.reply('🏓 Bot funguje!');
  }

  if (command === 'setup') {

    const guild = message.guild;

    message.channel.send('⚙ Přestavuji celý Discord server LegendLand...');

    // SMAZÁNÍ KANÁLŮ
    guild.channels.cache.forEach(c => c.delete().catch(() => {}));

    // SMAZÁNÍ ROLÍ
    guild.roles.cache.forEach(r => {
      if (r.name !== "@everyone" && !r.managed) {
        r.delete().catch(() => {});
      }
    });

    // ROLE
    const roles = [
      "🌸 Majitelka DC",
      "👑 Majitel",
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

    for (const name of roles) {
      await guild.roles.create({ name });
    }

    // KATEGORIE + KANÁLY
    const createCat = async (name, channels) => {
      const cat = await guild.channels.create({ name, type: 4 });
      for (const ch of channels) {
        await guild.channels.create({ name: ch, type: 0, parent: cat.id });
      }
    };

    await createCat("👋 Ověření", [
      "👋│vitej",
      "📜│pravidla",
      "✅│overeni"
    ]);

    await createCat("📢 Informace", [
      "📢│oznámení",
      "🧭│jak-se-pripojit",
      "🌐│hlasovaci-stranky",
      "🗺│dynmapa",
      "📱│socialni-site"
    ]);

    await createCat("💬 Komunita", [
      "💬│pokec",
      "📷│fotky",
      "💡│napady",
      "🏗│stavby",
      "🗳│hlasovani"
    ]);

    await createCat("⛏ Minecraft", [
      "⛏│mc-chat",
      "📜│commandy",
      "🦠│nemoci",
      "🏠│home",
      "🏡│residence"
    ]);

    await createCat("🎫 Podpora", [
      "🎫│podpora",
      "📋│nabory"
    ]);

    await createCat("📜 Logy", [
      "📜│log-zprávy",
      "🔨│log-moderace"
    ]);

    // VOICE
    const voice = await guild.channels.create({ name: "🎤 HLASOVÉ", type: 4 });

    const voiceChannels = ["🔊 Hlas 1","🔊 Hlas 2","🔊 Hlas 3","🎵 Hudba","🌙 AFK"];

    for (const v of voiceChannels) {
      await guild.channels.create({ name: v, type: 2, parent: voice.id });
    }

    message.channel.send("✅ LegendLand Discord byl vytvořen.");
  }
});

client.login(process.env.TOKEN);
