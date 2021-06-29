//Menu.js
//wrapper of display and reaction buttons

const logger = require('log4js').getLogger('menu')
logger.level = 'debug'

const Display = require('./Display')
const Reactor = require('./Reactor')

class Menu {
  constructor(context) {
    this.context = context
    this.display = new Display(context)
    this.reactor = new Reactor(context)
  }

  async flush(asCode, embed, msgObj) {
    //send display to channel
    if (msgObj) {
      msgObj.edit(this.display.generateAsText(), { code: asCode, embed })
      return msgObj
    }
    const msg = await this.sendToChannel(
      this.context.triggerMsg.channel.id,
      this.display.generateAsText(),
      asCode,
      embed
    )

    if (this.reactor.map.size !== 0) {
      this.reactor.bindToMessage(msg)
      this.reactor.publish()
    }
    return msg
  }

  async sendToChannel(channelId, message, asCode = false, embed) {
    const msg = await this.context.client.channels.cache
      .get(channelId)
      .send(message, { code: asCode, embed })
    return msg
  }

  async continue() {
    await this.flush()
  }

  async save() {
    this.reactor.collector && this.reactor.collector.stop()
  }

  setDisplayText(newText) {
    this.display.setText(newText)
  }

  setReaction(object) {
    this.reactor.setReaction(object)
  }
}

module.exports = Menu
