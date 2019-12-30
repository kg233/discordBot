const Discord = require('discord.js');
const { prefix } = require('./prefix.json');
const imagePick = require('./src/imgPick');
require('dotenv').config();
const token = process.env.token;
const client = new Discord.Client();
const mongoose = require('mongoose');

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
      imagePick()
        .then(url => {
          message.channel.send({
            files: [url],
          });
          console.log('this is url', url);
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
  }
});

mongoose
  .connect(
    `mongodb+srv://bot:ULoWN5hxBuDutFjf@cluster0-ihxwd.azure.mongodb.net/discordBot?retryWrites=true&w=majority`
  )
  .then(() => {
    client.login(token);
  })
  .catch(err => {
    console.log(err);
  });
