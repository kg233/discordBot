const logger = require('log4js').getLogger('analyzer')
logger.level = 'info' 

class Analyzer {
  constructor() {
  }

  sort() {
    
  }

  async check(){
    
  }

  setCards(cards) {
    this.cards = cards
    this.sort(this.cards)
  }

  async analyze() {
    if (!this.cards) return
    let {strength, cards} = await this.check(this.cards)

    logger.debug("checking Analyzer card result")

    for (let card of cards) {
      logger.debug(card.toString())
    }

    return {strength, cards}
  }
}

module.exports = Analyzer