const { pokerCombinations, maxCards } = require('../defs')
const HandEvaluator = require('../evaluator/HandEvaluator')

const logger = require('log4js').getLogger('Cards')
logger.level = 'debug' 

class Cards {
  constructor(initialHand) {
    this.hand = []
    if (initialHand) {
      this.hand = initialHand //an array of Card
    }
    
    this.strength = 0
    this.combo = null //cards forming the combo
  }

  addCard(card) {
    if (this.hand.length === maxCards) return;

    this.hand.push(card);
  }

  //return the best strength of current hand, also sets disambig for ties
  async evaluate() {
    if (this.hand.length !== maxCards) {
      logger.debug(`not enough cards to evaluete. Needs ${maxCards} cards, has ${this.hand.length}`)
    }

    const handEval = new HandEvaluator(this.hand)

    const {strength, cards} = await handEval.eval()
    
    
    this.strength = strength
    this.combo = cards

    logger.info(`--------card result: ${pokerCombinations[this.strength]}-----------`)
    for (let card of this.combo) {
      logger.info(card.toString())
    }
    return strength;
  }

  getCombo() {
    return this.combo;
  }

  getHand() {
    return this.hand
  }

  toString() {
    let res = ""

    for (let card of this.hand) {
      res += card + " & "
    }

    return res.slice(0, res.length - 2)
  }
}

module.exports = Cards