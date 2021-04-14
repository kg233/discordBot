//Display.js
//parses strings to be displayed on screen
const logger = require('log4js').getLogger('display')
logger.level = 'debug'

class Display {
  constructor(initialText) {
    logger.info('display class constructed!')
    if (initialText === undefined) {
      logger.error('did not provide a initial string')
      return
    }
    this.selectedRow = -1
    this.text = initialText
    this.groups = this.breakText(initialText)
    logger.debug(`constructed groups values ${this.groups}`)
  }

  breakText(text) {
    return text.split('\n')
  }

  setText(newText) {
    if (!newText) return
    this.text = newText
    this.groups = this.breakText(newText)
    this.selectedRow = -1
  }

  setSelectedRow(num) {
    //index base
    this.selectedRow = Math.max(0, Math.min(num, this.groups.length - 1))
  }

  clearAll() {
    this.text = ''
    this.groups = []
    this.setSelectedRow = -1
  }

  generateAsText() {
    let output = this.groups
    output[this.selectedRow] = '**' + output[this.selectedRow] + '**'

    return output.join('\n')
  }
}

module.exports = Display
