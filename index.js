require('dotenv').config()
//create a global map to keep track of user context
let mappedInvoked = new Map()
exports.invokes = mappedInvoked
//imports
const Discord = require('discord.js')
const log4js = require('log4js')
const switchCommands = require('./switchCommands')
const Reminder = require('./Reminder/Reminder')
const Dealer = require("./poker/dealer/Dealer")
const Cards = require("./poker/card/Cards")

//set up logger
var logger = log4js.getLogger()
logger.level = 'debug'

//set up bot client
const client = new Discord.Client()

function buildContext(triggerMsg) {
  return {
    client,
    triggerMsg,
  }
}

client.on('ready', () => {
  logger.debug(`Logged in as ${client.user.tag}!`)
  //set up reminder tracker
  // Reminder.getInstance().attachClientAndStart(client)
})

client.on('message', (msg) => {
  if (msg.author.id !== client.user.id) {
    switchCommands(buildContext(msg))
  }
})

client.login(process.env.token)


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// let dealer = new Dealer()
// dealer.shuffle()
// let c = new Cards()

// c.addCard(dealer.deal())
// c.addCard(dealer.deal())
// c.addCard(dealer.deal())
// c.addCard(dealer.deal())
// c.addCard(dealer.deal())
// c.addCard(dealer.deal())
// c.addCard(dealer.deal())



// // c.addCard(new Card(3, 0, false))
// // c.addCard(new Card(3, 1, false))
// // c.addCard(new Card(3, 2, false))
// // c.addCard(new Card(3, 3, false))
// // c.addCard(new Card(8, 1, false))
// // c.addCard(new Card(8, 0, false))
// // c.addCard(new Card(8, 3, false))

// c.evaluate()