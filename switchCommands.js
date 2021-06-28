const { prefix: PREFIX } = require('./prefix.json')
const fs = require('fs')
const Reader = require('./Reader/Reader')
let { invokes } = require('./index')
const Loading = require('./Loading/Loading')
const Jb = require('./jb/Jb')
const ReminderCommand = require('./Reminder/ReminderCommand')
const Player = require('./player/Player')
const PokerGame = require('./poker/PokerGame')

const logger = require('log4js').getLogger('switch')
logger.level = 'debug'

let pokerGame = null

function runSavedInvokeOrSave(context) {
  const command = context.triggerMsg.content
  const requester = context.triggerMsg.author.id
  if (invokes.has(requester)) {
    if (
      command.split(' ')[0] ===
      PREFIX + invokes.get(requester).constructor.TRIGGER
    ) {
      //save invoked the same invoke, run continue
      logger.debug('found saved invoke, running it')
      invokes.get(requester).continue()
      return 1
    } else {
      //do save on previous stateful invoke is there is one
      invokes.get(requester).save && invokes.get(requester).save()
      return 0
    }
  }

  return 0
}

//TODO
// function rateLimiting(context) {

// }

function switchCommands(context) {
  const command = context.triggerMsg.content
  const requester = context.triggerMsg.author.id
  if (match(command, 'ping')) {
    //stateless invoke
    if (!runSavedInvokeOrSave(context)) {
      const invoke = new Reader(
        context,
        fs.readFileSync('./Reader/default.txt', 'utf-8')
      )
      invokes.set(requester, invoke)
    }
    return
  }
  if (match(command, 'load')) {
    //stateful invoke
    if (!runSavedInvokeOrSave(context)) {
      const invoke = new Loading(context)
      invokes.set(requester, invoke)
    }
    return
  }
  if (match(command, 'jb')) {
    if (!runSavedInvokeOrSave(context)) {
      const invoke = new Jb(context)
      invokes.set(requester, invoke)
    }
    return
  }
  if (match(command, 'remind')) {
    if (!runSavedInvokeOrSave(context)) {
      const invoke = new ReminderCommand(context)
      invokes.set(requester, invoke)
    }
    return
  }
  if (match(command, 'jz')) {
    if (!runSavedInvokeOrSave(context)) {
      const invoke = new Player(context, './player/pinwheel.mp3')
      invokes.set(requester, invoke)
    }
    return
  }
  if (match(command, "poker new join start")) {
    pokerGame = new PokerGame(context)
    pokerGame.join(context.triggerMsg.author.id)
    pokerGame.startNewRound()
    return
  }
  if (match(command, "poker new join")) {
    pokerGame = new PokerGame(context)
    pokerGame.join(context.triggerMsg.author.id)
    return
  }
  if (match(command, "poker start")) {
    if (pokerGame) {
      pokerGame.startNewRound()
    }
    else {
      console.error("Poker game not found")
    }
    return
  }
  if (match(command, "poker join")) {
    if (pokerGame) {
      pokerGame.join(context.triggerMsg.author.id)
    }
    else {
      console.error("Poker game not found")
    }
    return
  }

  if (match(command, "poker new")) {
    pokerGame = new PokerGame(context)
    return
  }
  if (match(command, "check")) {
    pokerGame.handlePlayerAction(context.triggerMsg.author.id, "check")
    return
  }
}

function match(command, invokeToken) {
  return command.startsWith(PREFIX + invokeToken)
}

module.exports = switchCommands
