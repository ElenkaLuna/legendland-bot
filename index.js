const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log("✅ BOT ONLINE");
});

client.on('messageCreate', async message => {

  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const command = message.content.slice(1).toLowerCase();

  if (command === "setup") {

    const guild = message.guild;

    await message.channel.send("⚙ Spouštím kompletní setup...");

    // SMAZÁNÍ KANÁLŮ
    for (const channel of guild.channels.cache.values()) {
      try { await channel.delete(); } catch {}
    }

    // SMAZÁNÍ ROLÍ
    for (const role of guild.roles.cache.values()) {
      if (role.name !== "@everyone") {
        try { await role.delete(); } catch {}
      }
    }

    // ROLE
    async function create(name, color) {
      return await guild.roles.create({ name, color });
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

    // KATEGORIE
    const overeni = await guild.channels.create({ name:"👋 Ověření", type:4 });
    const info = await guild.channels.create({ name:"📢 Informace", type:4 });
    const komunita = await guild.channels.create({ name:"💬 Komunita", type:4 });

    // KANÁLY
    await guild.channels.create({ name:"👋│vitej", type:0, parent:overeni.id });
    await guild.channels.create({ name:"📜│pravidla", type:0, parent:overeni.id });
    await guild.channels.create({ name:"✅│overeni", type:0, parent:overeni.id });

    await guild.channels.create({ name:"📢│oznámení", type:0, parent:info.id });
    await guild.channels.create({ name:"🌐│hlasovaci-stranky", type:0, parent:info.id });

    await guild.channels.create({ name:"💬│pokec", type:0, parent:komunita.id });

    await message.channel.send("✅ HOTOVO");
  }

});

client.login(process.env.TOKEN);
