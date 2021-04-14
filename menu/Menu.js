//Menu.js
//wrapper of display and reaction buttons

const logger = require('log4js').getLogger('menu')
logger.level = 'debug'

const Display = require('./display')
const Reactor = require('./Reactor')

class Menu {
  constructor(context) {
    //context need to have: client, display message, a map of reaction and its callbacks
    this.context = context
    this.display = new Display(context.displayMessage)
    this.reactor = new Reactor()
    this.reactor.setReaction(context.reactions)
  }

  async flush(channelId) {
    //send display to channel
    const msg = await this.sendToChannel(
      channelId,
      this.display.generateAsText()
    )
    this.reactor.bindToMessage(msg)
    this.reactor.publish()
  }

  async sendToChannel(channelId, message) {
    if (!this.context.client) {
      logger.warn('context does not contain client information')
      return
    }
    const msg = await this.context.client.channels.cache
      .get(channelId)
      .send(message)
    logger.debug('flush sent message with id: ' + msg.id)
    return msg
  }
}

module.exports = Menu
