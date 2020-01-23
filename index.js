const Discord = require('discord.js')
const { prefix } = require('./prefix.json')

const dialog = require('./components/dialog')

const imagePick = require('./src/imgPick')

const getTodos = require('./src/getTodos')
const { addTodos } = require('./queries/queries')

const getPlayer = require('./src/getPlayer')

require('dotenv').config()

const token = process.env.token
const client = new Discord.Client()
const mongoose = require('mongoose')

const ME = '660763160810094592'

const choiceMap = {
  '🇦': 'A',
  '🇧': 'B',
  '🇨': 'C',
  '🇩': 'D',
  '🇪': 'E',
  '🇫': 'F',
}

//todo work in progress

const lookup = {} //change this variable's name

//todo work in progress

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  console.log(message.content)
})

client.on('messageReactionAdd', (msgrcn, user) => {
  msgrcn
    .fetchUsers()
    .then(obj => {
      if (ME != obj.firstKey(1)[0]) {
        let msgid = msgrcn.message.id
        if (msgid in lookup) {
          msgrcn.remove(user)
          lookup[msgid].handle(msgrcn.emoji.name)
        }
      }
    })
    .catch(err => {
      console.log(err)
      throw err
    })
})

client.on('message', message => {
  if (message.content.startsWith(prefix)) {
    if (message.content === prefix + 'ping') {
      message.channel.send('Pong!')
    } else if (message.content === prefix + 'help') {
      const { help } = require('./components/help_text.json')
      message.channel.send(help, { code: true })
    } else if (message.content === prefix + 'git') {
      message.channel.send('https://github.com/kg233/discordBot')
    } else if (message.content === prefix + 'kg') {
      message.channel.send('KnmbG')
    } else if (message.content === prefix + 'hentai') {
      imagePick()
        .then(url => {
          message.channel.send({
            files: [url],
          })
        })
        .catch(err => {
          console.log(err)
          throw err
        })
    } else if (message.content === prefix + 'dialog') {
      dialog(message)
    } else if (message.content === prefix + 'showTodo') {
      message.channel
        .send('loading', { code: true })
        .then(msg => {
          getTodos(message.author.id, msg)
            .then(todo => {
              if (todo === null) {
                msg.edit(
                  'you have no todos, make a new todo by using addTodo',
                  { code: true }
                )
              } else {
                lookup[msg.id] = todo
                lookup[msg.id].start()
              }
            })
            .catch(err => {
              console.log(err)
              throw err
            })
        })
        .catch(err => {
          console.log(err)
          throw err
        })
    } else if (message.content.split(' ')[0] === prefix + 'addTodo') {
      if (message.content.split(' ').length < 2) {
        message.channel.send('please enter a valid message')
      } else {
        let description = message.content
          .split(' ')
          .splice(1)
          .join(' ')

        addTodos(message.author.id, description)
          .then(_ => {
            message.channel.send(`added todo: ${description}`, { code: true })
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      }
    } else if (message.content === prefix + 'jo') {
      if (!message.member.voiceChannel) {
        message.channel.send('you must be in a voice channel first!')
        return
      }

      message.channel.send('loading...', { code: true }).then(msg => {
        getPlayer(msg, message.member).then(player => {
          lookup[msg.id] = player
          lookup[msg.id].start()
        })
      })
    }
  }
})

mongoose
  .connect(
    `mongodb+srv://bot:ULoWN5hxBuDutFjf@cluster0-ihxwd.azure.mongodb.net/discordBot?retryWrites=true&w=majority`
  )
  .then(() => {
    client.login(token)
  })
  .catch(err => {
    console.log(err)
  })
