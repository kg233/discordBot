const logger = require('log4js').getLogger('Dealer')
logger.level = 'debug' 

const Card = require("../card/Card");
const { NUM_CARDS_IN_DECK, NUM_VALUES_IN_DECK } = require("../defs");

class Dealer {
  constructor(){
    this.deck = null
  }

  buildDeck = () => {
    let deck = Array.from(new Array(NUM_CARDS_IN_DECK), (_, index) => index);
    let count = NUM_CARDS_IN_DECK + 1;
    while ((count -= 1)) {
      deck.push(deck.splice(Math.floor(Math.random() * count), 1)[0]);
    }
    return deck;
  };

  shuffle() {
    this.deck = this.buildDeck()
  }

  deal(isHand) {
    let cardNum = this.deck.splice(0, 1)
    logger.debug("dealing card " + cardNum)

    return new Card(cardNum % NUM_VALUES_IN_DECK, Math.floor(cardNum / NUM_VALUES_IN_DECK), isHand)
  }
}

module.exports = Dealer