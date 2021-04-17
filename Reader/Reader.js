//Reader
//stateless

const Menu = require('../menu/Menu')
const logger = require('log4js').getLogger('reader')
logger.level = 'debug'

class Reader extends Menu {
  constructor(context, displayMessage) {
    super(context)
    this.setDisplayText(displayMessage)
    this.setReaction({
      '⏫': this.top,
      '🔼': this.prev,
      '🔽': this.next,
      '⏬': this.bottom,
    })
    this.flush()
  }

  flush() {
    super.flush(true)
  }

  continue() {
    this.flush()
  }

  top() {
    logger.debug('top')
  }

  bottom() {
    logger.debug('bottom')
  }

  next() {
    logger.debug('next')
  }

  prev() {
    logger.debug('prev')
  }
}

module.exports = Reader
