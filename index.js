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

    await message.channel.send("⚙ Doplňuji server (NIC nemažu)...");

    async function createRole(name, color) {
      if (!guild.roles.cache.find(r => r.name === name)) {
        await guild.roles.create({ name, color });
      }
    }

    // ROLE
    await createRole("🌸 Majitelka DC", "#ff66cc");
    await createRole("👑 Majitel", "#ff0000");
    await createRole("🔧 Technik", "#3498db");
    await createRole("🛡 Admin", "#e74c3c");
    await createRole("💎 VIP", "#f1c40f");
    await createRole("🎮 Hráč", "#2ecc71");

    async function createChannel(name, parent = null) {
      if (!guild.channels.cache.find(c => c.name === name)) {
        await guild.channels.create({
          name,
          type: 0,
          parent: parent ? parent.id : null
        });
      }
    }

    async function createCategory(name) {
      let cat = guild.channels.cache.find(c => c.name === name);
      if (!cat) {
        cat = await guild.channels.create({ name, type: 4 });
      }
      return cat;
    }

    // KATEGORIE
    const overeni = await createCategory("👋 Ověření");
    const info = await createCategory("📢 Informace");
    const komunita = await createCategory("💬 Komunita");

    // KANÁLY
    await createChannel("👋│vitej", overeni);
    await createChannel("📜│pravidla", overeni);
    await createChannel("✅│overeni", overeni);

    await createChannel("📢│oznámení", info);
    await createChannel("🌐│hlasovaci-stranky", info);

    await createChannel("💬│pokec", komunita);

    await message.channel.send("✅ HOTOVO (nic nesmazáno)");
  }

});

client.login(process.env.TOKEN);
