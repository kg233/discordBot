const Discord = require('discord.js');
const { prefix } = require('./prefix.json');
const imagePick = require('./src/imgPick');
const dialog = require('./components/dialog');
const Todos = require('./components/todo');

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

//todo work in progress
const testTodos = [
  { id: 1, description: 'do dishes', finished: false },
  { id: 1, description: "fuck vb's ass", finished: false },
  { id: 1, description: "fuck vb's ass again", finished: false },
  { id: 1, description: "fuck vb's ass again2", finished: false },
  { id: 1, description: "fuck vb's ass again3", finished: false },
  { id: 1, description: "fuck vb's ass 4", finished: false },
  { id: 1, description: "fuck vb's ass 5", finished: false },
  { id: 1, description: "fuck vb's ass 6", finished: false },
  { id: 1, description: "fuck vb's ass 7", finished: false },
  { id: 1, description: "fuck vb's ass 8", finished: false },
  { id: 1, description: "fuck vb's ass 9", finished: false },
  { id: 1, description: "fuck vb's ass 10", finished: false },
  { id: 1, description: 'do homework', finished: false },
  { id: 1, description: 'play neko para', finished: false },
  { id: 1, description: 'hit airplane', finished: false },
];

const lookup = {}; //change this variable's name

//todo work in progress

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  console.log(message.content);
});

client.on('messageReactionAdd', (msgrcn, user) => {
  msgrcn
    .fetchUsers()
    .then(obj => {
      if (ME != obj.firstKey(1)[0]) {
        //making sure it not the bot
        // msgrcn.message.edit(`you chose ${choiceMap[msgrcn.emoji.name]}`, {
        //   code: true,
        // });
        let msgid = msgrcn.message.id;
        if (msgid in lookup) {
          msgrcn.remove(user);
          lookup[msgid].handle(msgrcn.emoji.name);
        }
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
    } else if (message.content === prefix + 'todo') {
      let id = message.author.id;
      //fetch the todo list from mongoDB
      message.channel
        .send('loading', { code: true })
        .then(msg => {
          msg
            .react('⬆️')
            .then(rct => {
              rct.message.react('⬇️').then(rct => {
                rct.message.react('⬅️').then(rct => {
                  rct.message.react('➡️');
                });
              });
            })
            .catch(err => {
              console.log(err);
              throw err;
            });

          let temp = new Todos(msg, testTodos);
          lookup[msg.id] = temp;
          temp.render();
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
