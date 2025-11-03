require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel) {
    channel.send("🤖 Bot is online and ready to chat!");
  } else {
    console.log("⚠️ Could not find the channel. Check your CHANNEL_ID in .env.");
  }
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  // Greeting responses
  const greetings = ['hello', 'hi', 'hey', 'yo'];
  const randomReplies = [
    'Hey there 👋',
    'Yo! What’s up?',
    'Hi hi 👀',
    'Heyy! 😊',
    'Sup! 😎',
    'Hello hello! 🌟'
  ];

  if (greetings.includes(msg.content.toLowerCase())) {
    const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    msg.reply(reply);
    return;
  }

  // Add role command
  if (msg.content.toLowerCase().startsWith('!role ')) {
    const roleName = msg.content.split(' ')[1];
    if (!roleName) {
      msg.reply('❌ Please specify a role name!');
      return;
    }

    const role = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      msg.reply(`❌ Role "${roleName}" not found.`);
      return;
    }

    try {
      await msg.member.roles.add(role);
      msg.reply(`✅ Role **"${role.name}"** added!`);
    } catch (err) {
      console.error(err);
      msg.reply('⚠️ I don’t have permission to add that role.');
    }
    return;
  }

  // Remove role command
  if (msg.content.toLowerCase().startsWith('!remove ')) {
    const roleName = msg.content.split(' ')[1];
    if (!roleName) {
      msg.reply('❌ Please specify a role name to remove!');
      return;
    }

    const role = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      msg.reply(`❌ Role "${roleName}" not found.`);
      return;
    }

    try {
      await msg.member.roles.remove(role);
      msg.reply(`🗑️ Role **"${role.name}"** removed.`);
    } catch (err) {
      console.error(err);
      msg.reply('⚠️ I don’t have permission to remove that role.');
    }
  }
});

client.login(process.env.TOKEN);
