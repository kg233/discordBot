const { prefix: PREFIX } = require('./prefix.json')
const fs = require('fs')
const Reader = require('./Reader/Reader')
let { invokes } = require('./index')
const Loading = require('./Loading/Loading')

const logger = require('log4js').getLogger('switch')
logger.level = 'debug'

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
      logger.debug('creating new invoke')
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
      logger.debug('creating new invoke')
      const invoke = new Loading(context)
      invokes.set(requester, invoke)
    }
    return
  }
}

function match(command, invokeToken) {
  return command.startsWith(PREFIX + invokeToken)
}

module.exports = switchCommands
