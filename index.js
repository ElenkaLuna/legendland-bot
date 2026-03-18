const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// LOCK
async function lock(channel, guild) {
  await channel.permissionOverwrites.create(guild.roles.everyone, {
    SendMessages: false,
    AddReactions: false
  });
}

client.on('messageCreate', async message => {

  if (message.author.bot) return;

  const guild = message.guild;

  if (message.content === "!setup") {

    await message.channel.send("🔥 Nastavuji LegendLand...");

    for (const ch of guild.channels.cache.values()) {
      await ch.delete().catch(() => {});
    }

    const cat = async name => await guild.channels.create({ name, type: 4 });
    const text = async (name, parent) => await guild.channels.create({ name, type: 0, parent: parent.id });
    const voice = async (name, parent) => await guild.channels.create({ name, type: 2, parent: parent.id });

    // ===== Ověření
    const overeni = await cat("👋 Ověření");
    const vitej = await text("👋│vitej", overeni);
    const pravidla = await text("📜│pravidla", overeni);
    const overeniCh = await text("✅│overeni", overeni);

    await lock(vitej, guild);
    await lock(pravidla, guild);
    await lock(overeniCh, guild);

    // ===== Informace
    const info = await cat("📢 Informace");
    const oznameni = await text("📢│oznámení", info);
    await text("🧭│jak-se-pripojit", info);
    const hlas = await text("🌐│hlasovaci-stranky", info);
    const dyn = await text("🗺│dynmapa", info);
    await text("📱│socialni_site", info);

    await lock(oznameni, guild);
    await lock(hlas, guild);
    await lock(dyn, guild);

    // ===== Statistiky
    const stats = await cat("📊 Statistiky");
    const status = await text("📡│server-status", stats);
    await text("👥│hraci-online", stats);

    await lock(status, guild);

    // ===== Komunita
    const komunita = await cat("💬 Komunita");
    await text("💬│pokec", komunita);
    await text("📷│fotky", komunita);
    await text("💡│napady", komunita);
    await text("🏗│stavby", komunita);
    await text("🗳│hlasovani", komunita);

    // ===== Minecraft
    const mc = await cat("⛏ Minecraft");
    await text("⛏│mc-chat", mc);
    await text("📜│commandy", mc);
    await text("🦠│nemoci", mc);
    await text("🏠│home", mc);
    await text("🏡│residence", mc);

    // ===== Voice
    const voiceCat = await cat("🎤 HLASOVÉ KANÁLY");
    await voice("🔊│Hlas 1", voiceCat);
    await voice("🔊│Hlas 2", voiceCat);
    await voice("🔊│Hlas 3", voiceCat);
    await voice("🎵│Hudba", voiceCat);
    await voice("🌙│AFK", voiceCat);

    // ===== VIP
    const vip = await cat("💎 VIP");
    await text("💬│vipchat", vip);

    const vipVoice = await cat("🎤 HLASOVÉ KANÁLY VIP");
    await voice("🔊│Hlas 1", vipVoice);
    await voice("🔊│Hlas 2", vipVoice);
    await voice("🔊│Hlas 3", vipVoice);
    await voice("🎵│Hudba", vipVoice);

    // ===== Podpora
    const podpora = await cat("🎫 Podpora");
    await text("🎫│podpora", podpora);
    await text("📋│nabory", podpora);

    // ===== A-TEAM
    const team = await cat("🛡 A-TEAM");
    const adminNavod = await text("🛠│admin-navod", team);
    const adminPravidla = await text("📜│admin-pravidla", team);
    const ban = await text("🚨│banovaci_system", team);
    await text("💬│admin-chat", team);

    await lock(adminNavod, guild);
    await lock(adminPravidla, guild);
    await lock(ban, guild);

    // ===== LOGY
    const logy = await cat("📜 LOGY");
    const l1 = await text("📜│log-zprávy", logy);
    const l2 = await text("🔨│log-moderace", logy);
    const l3 = await text("👤│log-členové", logy);
    const l4 = await text("⚙│log-server", logy);

    await lock(l1, guild);
    await lock(l2, guild);
    await lock(l3, guild);
    await lock(l4, guild);

    await message.channel.send("✅ HOTOVO");
  }

  // VERIFY
  if (message.content === "!verify") {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("verify")
        .setLabel("✅ Ověřit se")
        .setStyle(ButtonStyle.Success)
    );

    message.channel.send({
      content: "Klikni pro ověření",
      components: [row]
    });
  }

  // TICKET
  if (message.content === "!ticket") {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket")
        .setLabel("🎫 Vytvořit ticket")
        .setStyle(ButtonStyle.Primary)
    );

    message.channel.send({
      content: "Klikni pro vytvoření ticketu",
      components: [row]
    });
  }

  // ANTI PING
  if (message.content.includes("@Staff")) {
    if (!message.member.permissions.has("Administrator")) {
      message.delete();
      message.channel.send("❌ Nemůžeš pingovat @Staff");
    }
  }

});

// BUTTONY
client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  if (interaction.customId === "verify") {

    const role = interaction.guild.roles.cache.find(r => r.name.includes("Hráč"));
    if (!role) return;

    await interaction.member.roles.add(role);

    await interaction.reply({ content: "✅ Ověření proběhlo!", ephemeral: true });
  }

  if (interaction.customId === "ticket") {

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: ['ViewChannel']
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages']
        }
      ]
    });

    await interaction.reply({ content: `🎫 Ticket: ${channel}`, ephemeral: true });
  }

});

client.login(process.env.TOKEN);
