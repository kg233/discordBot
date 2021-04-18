//Reader
//stateless

const Menu = require('../menu/Menu')
const logger = require('log4js').getLogger('reader')
logger.level = 'debug'

class Reader extends Menu {
  static TRIGGER = 'ping'

  constructor(context, displayMessage, asCode = true) {
    super(context)
    this.asCode = asCode
    this.setDisplayText(displayMessage)
    // this.setReaction({
    //   '⏫': this.top,
    //   '🔼': this.prev,
    //   '🔽': this.next,
    //   '⏬': this.bottom,
    // })
    this.flush()
  }

  flush() {
    super.flush(this.asCode)
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
