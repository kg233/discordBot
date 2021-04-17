require('dotenv').config()

//create a global map to keep track of user context
let mappedInvoked = new Map()
exports.invokes = mappedInvoked

//imports
const Discord = require('discord.js')
const log4js = require('log4js')
const switchCommands = require('./switchCommands')

//set up bot client
const client = new Discord.Client()

//set up logger
var logger = log4js.getLogger()
logger.level = 'debug'

function buildContext(triggerMsg) {
  return {
    client,
    triggerMsg,
  }
}

client.on('ready', () => {
  logger.debug(`Logged in as ${client.user.tag}!`)
})

client.on('message', (msg) => {
  if (msg.author.id !== client.user.id) {
    switchCommands(buildContext(msg))
  }
})

client.login(process.env.token)
