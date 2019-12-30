const Discord = require('discord.js');
const { prefix } = require('./prefix.json');
const imagePick = require('./src/imgPick');

const token = process.env.token;
const client = new Discord.Client();

console.log(token);

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
    } else if (message.content === prefix + 'kg') {
      message.channel.send('KnmbG');
    } else if (message.content === prefix + 'hentai') {
      channel.send({
        files: [imagePick()],
      });
    }
  }
});

client.login(token);
