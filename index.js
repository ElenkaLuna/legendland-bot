require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
 intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
 console.log('LegendLand BOT připraven');
});

client.on('messageCreate', async message => {
 if(message.author.bot) return;

 if(message.content === "!setup"){
  const guild = message.guild;

  await message.channel.send("⚙ Probíhá kompletní nastavení serveru...");

  // SMAZÁNÍ
  for (const ch of guild.channels.cache.values()) {
    await ch.delete().catch(()=>{});
  }

  for (const role of guild.roles.cache.values()) {
    if(role.name !== "@everyone") {
      await role.delete().catch(()=>{});
    }
  }

  // ROLE
  const majitelka = await guild.roles.create({name:"🌸 Majitelka DC", color:"#ff69b4"});
  const hrac = await guild.roles.create({name:"🎮 Hráč", color:"#00ff00"});

  // KANÁLY
  const overeni = await guild.channels.create({name:"OVĚŘENÍ", type:4});
  const vitej = await guild.channels.create({name:"👋│vitej", type:0, parent:overeni.id});
  const pravidla = await guild.channels.create({name:"📜│pravidla", type:0, parent:overeni.id});
  const verify = await guild.channels.create({name:"✅│overeni", type:0, parent:overeni.id});

  await message.channel.send("✅ Server nastaven");
 }
});

client.login(process.env.TOKEN);
