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
  const guild = message.guild;

  // ===== !setup (NIC NEMAŽE) =====
  if (command === "setup") {

    await message.channel.send("⚙ Doplňuji server...");

    async function createRole(name, color) {
      if (!guild.roles.cache.find(r => r.name === name)) {
        await guild.roles.create({ name, color });
      }
    }

    // základ role (jen pokud chybí)
    await createRole("💎 VIP", "#f1c40f");
    await createRole("🎮 Hráč", "#2ecc71");
    await createRole("🛡 Admin", "#e74c3c");

    async function getCategory(name) {
      let cat = guild.channels.cache.find(c => c.name === name);
      if (!cat) cat = await guild.channels.create({ name, type: 4 });
      return cat;
    }

    async function createText(name, parent, perms = []) {
      let ch = guild.channels.cache.find(c => c.name === name);
      if (!ch) {
        ch = await guild.channels.create({
          name,
          type: 0,
          parent: parent.id,
          permissionOverwrites: perms
        });
      }
    }

    async function createVoice(name, parent, perms = []) {
      let ch = guild.channels.cache.find(c => c.name === name);
      if (!ch) {
        ch = await guild.channels.create({
          name,
          type: 2,
          parent: parent.id,
          permissionOverwrites: perms
        });
      }
    }

    const vipRole = guild.roles.cache.find(r => r.name.includes("VIP"));

    // ===== VIP =====
    const vip = await getCategory("💎 VIP");

    await createText("💎│vip-chat", vip, [
      { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
      { id: vipRole?.id, allow: ['ViewChannel'] }
    ]);

    await createVoice("🔊│vip-hlas", vip, [
      { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
      { id: vipRole?.id, allow: ['ViewChannel', 'Connect'] }
    ]);

    // ===== A-TEAM =====
    const team = await getCategory("🛠 A-TEAM");

    await createText("📢│admin-oznameni", team);
    await createText("💬│admin-chat", team);
    await createText("🔨│banovaci-system", team);

    // ===== NÁVODY =====
    const navody = await getCategory("📘 Návody");

    await createText("📘│navody", navody);
    await createText("🤖│bot-navod", navody);
    await createText("🎵│hudba", navody);

    await message.channel.send("✅ HOTOVO (kompletní bez mazání)");
  }

});

client.login(process.env.TOKEN);
