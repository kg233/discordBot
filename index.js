const Discord = require('discord.js')
const log4js = require('log4js')
const Menu = require('./menu/Menu')

const client = new Discord.Client()

//one menu per user?
const menu = new Menu({
  client,
  displayMessage: "choose a reaction, I won't tell :P",
  reactions: {
    '🅰️': () => logger.info('choose A'),
    '🅱️': () => logger.info('choose B'),
  },
})

var logger = log4js.getLogger()
logger.level = 'debug'

client.on('ready', () => {
  logger.debug(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    menu.flush(msg.channel.id)
  }
})

client.login('NjYwNzYzMTYwODEwMDk0NTky.XghlpQ.b6fuHRUgF65sXqYrWWvuSOckKpA')
