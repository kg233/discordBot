//Display.js
//parses strings to be displayed on screen
const logger = require('log4js').getLogger('display')
logger.level = 'debug'

class Display {
  constructor(context) {
    this.context = context
    logger.info('display class constructed!')
  }

  breakText(text) {
    return text.split('\n')
  }

  setText(newText) {
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
    if (this.selectedRow !== -1) {
      output[this.selectedRow] = '**' + output[this.selectedRow] + '**'
    }

    return output.join('\n')
  }
}

module.exports = Display
