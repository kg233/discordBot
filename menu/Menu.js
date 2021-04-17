//Menu.js
//wrapper of display and reaction buttons

const logger = require('log4js').getLogger('menu')
logger.level = 'debug'

const Display = require('./Display')
const Reactor = require('./Reactor')

class Menu {
  constructor(context) {
    //context need to have: client, requester, channel
    this.context = context
    this.display = new Display(context)
    this.reactor = new Reactor(context)
  }

  async flush(asCode) {
    //send display to channel
    const msg = await this.sendToChannel(
      this.context.triggerMsg.channel.id,
      this.display.generateAsText(),
      false
    )
    this.reactor.bindToMessage(msg)
    this.reactor.publish()
  }

  async sendToChannel(channelId, message, asCode = false) {
    const msg = await this.context.client.channels.cache
      .get(channelId)
      .send(message)
    logger.debug('flush sent message with id: ' + msg.id)
    return msg
  }

  setDisplayText(newText) {
    this.display.setText(newText)
  }

  setReaction(object) {
    this.reactor.setReaction(object)
  }
}

module.exports = Menu
