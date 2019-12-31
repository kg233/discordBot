const Discord = require('discord.js');
const { prefix } = require('./prefix.json');
const imagePick = require('./src/imgPick');
const dialog = require('./components/dialog');

require('dotenv').config();

const token = process.env.token;
const client = new Discord.Client();
const mongoose = require('mongoose');

const ME = '660763160810094592';

const choiceMap = {
  '🇦': 'A',
  '🇧': 'B',
  '🇨': 'C',
  '🇩': 'D',
  '🇪': 'E',
  '🇫': 'F',
};

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  console.log(message.content);
});

client.on('messageReactionAdd', (reaction, user) => {
  reaction
    .fetchUsers()
    .then(obj => {
      if (ME != obj.firstKey(1)[0]) {
        reaction.message.edit(`you chose ${choiceMap[reaction.emoji.name]}`, {
          code: true,
        });
      }
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

client.on('message', message => {
  if (message.content.startsWith(prefix)) {
    if (message.content === prefix + 'ping') {
      message.channel.send('Pong!');
    } else if (message.content === prefix + 'help') {
      const { help } = require('./components/help_text.json');
      message.channel.send(help, { code: true });
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
    } else if (message.content === prefix + 'dialog') {
      dialog(message);
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
