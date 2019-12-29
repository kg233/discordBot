const Discord = require('discord.js');
const { prefix } = require('./prefix.json');
// const { token } = require('./token.json');
const token = process.env.token;
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  console.log(message.content);
});

client.on('message', message => {
  if (message.content.startsWith(prefix)) {
    if (message.content === prefix + 'ping') {
      message.channel.send('Pong!');
    } else if (message.content === prefix + 'help') {
      const { help } = require('./components/help_text.json');
      message.channel.send(help);
    } else if (message.content === prefix + 'git') {
      message.channel.send('https://github.com/kg233/discordBot');
    }
  }
});

client.login(token);
