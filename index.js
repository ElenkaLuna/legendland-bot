const { Client, GatewayIntentBits, PermissionsBitField, ChannelType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log("✅ LegendLand BOT online");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setup') {

    const guild = interaction.guild;

    await interaction.reply("⚙ Vytvářím kompletní LegendLand server...");

    // ===== SMAZÁNÍ =====
    await guild.channels.cache.forEach(c => c.delete().catch(()=>{}));
    await guild.roles.cache.forEach(r => {
      if (r.name !== "@everyone") r.delete().catch(()=>{});
    });

    // ===== ROLE =====
    const roles = {};

    async function create(name, color) {
      roles[name] = await guild.roles.create({ name, color });
    }

    await create("🌸 Majitelka DC", "#ff66cc");
    await create("👑 Majitel", "#ff0000");

    await create("🔧 Technik", "#3498db");
    await create("🔧 Technička", "#3498db");

    await create("🛡 Hlavní admin", "#c0392b");
    await create("🛡 Hlavní adminka", "#c0392b");

    await create("⚔ Admin", "#e74c3c");
    await create("⚔ Adminka", "#e74c3c");

    await create("⭐ Helper+", "#2ecc71");
    await create("⭐ Helperka+", "#2ecc71");

    await create("🛟 Helper", "#27ae60");
    await create("🛟 Helperka", "#27ae60");

    await create("🏗 Hlavní stavitel", "#8e5a2b");
    await create("🏗 Hlavní stavitelka", "#8e5a2b");

    await create("🧱 Stavitel", "#a97142");
    await create("🧱 Stavitelka", "#a97142");

    await create("🎉 Eventer", "#9b59b6");
    await create("🎉 Eventerka", "#9b59b6");

    await create("📢 Tvůrce obsahu", "#e67e22");
    await create("📢 Tvůrkyně obsahu", "#e67e22");

    await create("🩺 Doktor", "#1abc9c");
    await create("🩺 Doktorka", "#1abc9c");

    await create("💎 VIP", "#f1c40f");
    await create("💠 VIP+", "#f39c12");
    await create("👑 VIP++", "#f39c12");
    await create("✨ Legend VIP", "#f1c40f");

    await create("🎮 Hráč", "#2ecc71");
    await create("🏅 Aktivní", "#3498db");
    await create("⭐ Zkušený", "#9b59b6");
    await create("💠 Veterán", "#1abc9c");
    await create("💎 Legenda", "#f1c40f");

    await create("🤖 Bot", "#95a5a6");

    // ===== KATEGORIE =====

    const overeni = await guild.channels.create({
      name: "👋 Ověření",
      type: ChannelType.GuildCategory
    });

    const info = await guild.channels.create({
      name: "📢 Informace",
      type: ChannelType.GuildCategory
    });

    const stats = await guild.channels.create({
      name: "📊 Statistiky",
      type: ChannelType.GuildCategory
    });

    const komunita = await guild.channels.create({
      name: "💬 Komunita",
      type: ChannelType.GuildCategory
    });

    const mc = await guild.channels.create({
      name: "⛏ Minecraft",
      type: ChannelType.GuildCategory
    });

    const voice = await guild.channels.create({
      name: "🎤 Hlasové kanály",
      type: ChannelType.GuildCategory
    });

    const vip = await guild.channels.create({
      name: "💎 VIP",
      type: ChannelType.GuildCategory
    });

    const podpora = await guild.channels.create({
      name: "🎫 Podpora",
      type: ChannelType.GuildCategory
    });

    const at = await guild.channels.create({
      name: "🛡 A-TEAM",
      type: ChannelType.GuildCategory
    });

    const logy = await guild.channels.create({
      name: "📜 Logy",
      type: ChannelType.GuildCategory
    });

    // ===== KANÁLY =====

    await guild.channels.create({ name:"👋│vitej", type:0, parent:overeni.id });
    await guild.channels.create({ name:"📜│pravidla", type:0, parent:overeni.id });
    await guild.channels.create({ name:"✅│overeni", type:0, parent:overeni.id });

    await guild.channels.create({ name:"📢│oznámení", type:0, parent:info.id });
    await guild.channels.create({ name:"🧭│jak-se-pripojit", type:0, parent:info.id });
    await guild.channels.create({ name:"🌐│hlasovaci-stranky", type:0, parent:info.id });
    await guild.channels.create({ name:"🗺│dynmapa", type:0, parent:info.id });
    await guild.channels.create({ name:"📱│socialni-site", type:0, parent:info.id });

    await guild.channels.create({ name:"📡│server-status", type:0, parent:stats.id });

    await guild.channels.create({ name:"💬│pokec", type:0, parent:komunita.id });
    await guild.channels.create({ name:"📷│fotky", type:0, parent:komunita.id });
    await guild.channels.create({ name:"💡│napady", type:0, parent:komunita.id });

    await guild.channels.create({ name:"⛏│mc-chat", type:0, parent:mc.id });
    await guild.channels.create({ name:"📜│commandy", type:0, parent:mc.id });
    await guild.channels.create({ name:"🦠│nemoci", type:0, parent:mc.id });

    await guild.channels.create({ name:"🔊│Hlas 1", type:2, parent:voice.id });
    await guild.channels.create({ name:"🔊│Hlas 2", type:2, parent:voice.id });
    await guild.channels.create({ name:"🔊│Hlas 3", type:2, parent:voice.id });
    await guild.channels.create({ name:"🎵│Hudba", type:2, parent:voice.id });
    await guild.channels.create({ name:"🌙│AFK", type:2, parent:voice.id });

    await guild.channels.create({ name:"💬│vipchat", type:0, parent:vip.id });

    await guild.channels.create({ name:"🎫│podpora", type:0, parent:podpora.id });
    await guild.channels.create({ name:"📋│nabory", type:0, parent:podpora.id });

    await guild.channels.create({ name:"🛠│admin-navod", type:0, parent:at.id });
    await guild.channels.create({ name:"📜│admin-pravidla", type:0, parent:at.id });
    await guild.channels.create({ name:"🚨│banovaci-system", type:0, parent:at.id });

    await guild.channels.create({ name:"📜│log-zprávy", type:0, parent:logy.id });
    await guild.channels.create({ name:"🔨│log-moderace", type:0, parent:logy.id });

    await interaction.followUp("✅ HOTOVO – server vytvořen podle plánu");

  }
});

client.login(process.env.TOKEN);
