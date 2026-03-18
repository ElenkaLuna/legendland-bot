const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (message.content !== "!setup") return;

  const guild = message.guild;

  await message.channel.send("🔥 Přepisuju server přesně podle návrhu...");

  // ❌ SMAŽE VŠECHNY KANÁLY
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(() => {});
  }

  // ===== KATEGORIE + KANÁLY =====

  const overeni = await guild.channels.create({ name: "👋 Ověření", type: 4 });
  await guild.channels.create({ name: "👋│vitej", type: 0, parent: overeni.id });
  await guild.channels.create({ name: "📜│pravidla", type: 0, parent: overeni.id });
  await guild.channels.create({ name: "✅│overeni", type: 0, parent: overeni.id });

  const info = await guild.channels.create({ name: "📢 Informace", type: 4 });
  await guild.channels.create({ name: "📢│oznámení", type: 0, parent: info.id });
  await guild.channels.create({ name: "🧭│jak-se-pripojit", type: 0, parent: info.id });
  await guild.channels.create({ name: "🌐│hlasovaci-stranky", type: 0, parent: info.id });
  await guild.channels.create({ name: "🗺│dynmapa", type: 0, parent: info.id });
  await guild.channels.create({ name: "📱│socialni-site", type: 0, parent: info.id });

  const komunita = await guild.channels.create({ name: "💬 Komunita", type: 4 });
  await guild.channels.create({ name: "💬│pokec", type: 0, parent: komunita.id });
  await guild.channels.create({ name: "📷│fotky", type: 0, parent: komunita.id });
  await guild.channels.create({ name: "💡│napady", type: 0, parent: komunita.id });
  await guild.channels.create({ name: "🏗│stavby", type: 0, parent: komunita.id });
  await guild.channels.create({ name: "🗳│hlasovani", type: 0, parent: komunita.id });

  const vip = await guild.channels.create({ name: "💎 VIP", type: 4 });
  await guild.channels.create({ name: "💬│vipchat", type: 0, parent: vip.id });

  const team = await guild.channels.create({ name: "🛡 A-TEAM", type: 4 });
  await guild.channels.create({ name: "📢│admin-oznameni", type: 0, parent: team.id });
  await guild.channels.create({ name: "💬│admin-chat", type: 0, parent: team.id });
  await guild.channels.create({ name: "🔨│banovaci-system", type: 0, parent: team.id });

  const logy = await guild.channels.create({ name: "📜 Logy", type: 4 });
  await guild.channels.create({ name: "📜│log-zpravy", type: 0, parent: logy.id });
  await guild.channels.create({ name: "🔨│log-moderace", type: 0, parent: logy.id });
  await guild.channels.create({ name: "👤│log-clenove", type: 0, parent: logy.id });
  await guild.channels.create({ name: "⚙│log-server", type: 0, parent: logy.id });

  await message.channel.send("✅ HOTOVO – server je přesně podle dokumentu");
});

client.login(process.env.TOKEN);
