//Reactor.js
//contains info about the list of reactions under a display message, contain their callbacks as well(?)
const logger = require('log4js').getLogger('reactor')
logger.level = 'debug'

class Reactor {
  constructor() {
    //<reaction, callback> pairs
    this.map = new Map()
    this.message = null
    this.timeoutMs = 60000
  }

  bindToMessage(message) {
    //message is the message object
    this.message = message
  }

  appendReaction(reaction, callback) {
    this.map.set(reaction, callback)
  }

  setReaction(obj) {
    //a {reaction: callback, ...} object
    this.map = new Map(Object.entries(obj))
  }

  setTimeout(ms) {
    this.timeoutMs = ms
  }

  async publish() {
    if (this.collector) {
      this.collector.stop()
    }
    for (let reaction of this.map.keys()) {
      logger.debug('publishing reaction: ', reaction)
      await this.message.react(reaction)
    }
    this.collector = this.initializeCollector()
  }

  initializeCollector() {
    const collector = this.message.createReactionCollector(() => true, {
      time: this.timeoutMs,
    }) //no filter currently
    collector.on('collect', (r) => {
      logger.debug(`Collected ${r.emoji.name}`)
      if (this.map.has(r.emoji.name)) {
        this.map.get(r.emoji.name)
      }
    })
    collector.on('end', () => logger.debug('collector stopped'))
    return collector
  }
}

module.exports = Reactor
