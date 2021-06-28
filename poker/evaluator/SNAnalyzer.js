//Same Number Analyzer

const Analyzer = require('./Analyzer')

const logger = require('log4js').getLogger('SNAnalyzer')
logger.level = 'info'

class SNAnalyzer extends Analyzer {
  constructor() {
    super()
  }

  sort(cards) {
    cards.sort((a, b) => a.getRank() - b.getRank())
    logger.info("cards:")
    for (let card of cards) {
      
      logger.info (card.toString())
    }
  }

  async check() {
    const cards = this.cards

    let bucket1 = []
    let bucket2 = []

    let tempBucket = []

    for (let card of cards) {
      logger.debug("looking at " + card)
      if (tempBucket.length === 0) {
        logger.debug("0")
        tempBucket.push(card)
      } else if (tempBucket[0].getRank() === card.getRank()) {
        logger.debug("1")
        tempBucket.push(card)
      } else {
        if (tempBucket.length <= 1) {
          // no pairs found for this rank
          logger.debug("2")
          tempBucket = [card]
        } else if (bucket1.length === 0 || (bucket1.length === 2 && bucket2.length !== 0)) {
          logger.debug("3")
          bucket1 = [...tempBucket]
          tempBucket = [card]
        } else {
          logger.debug("4")
          bucket2 = [...tempBucket]
          tempBucket = [card]
        }
      }
      logger.debug("5")
    }

    if (tempBucket.length <= 1) {
      logger.debug("no remain is temp bucket")
    } else if (bucket1.length === 0 || (bucket1.length === 2 && bucket2.length !== 0)) {
      logger.debug("3")
      bucket1 = [...tempBucket]
    } else {
      logger.debug("4")
      bucket2 = [...tempBucket]
    }

    logger.debug("---bucket1---")
    for (let card of bucket1) {
      logger.debug(card)
    }
    logger.debug("---bucket2---")
    for (let card of bucket2) {
      logger.debug(card)
    }

    if (bucket1.length === 0 && bucket2.length === 0) {
      return {strength: 0, cards: []}
    }

    //at least a pair
    let strength = 1
    let ccards = bucket1.concat(bucket2)

    if (bucket1.length === 4 || bucket2.length === 4) {
      //four of a kind
      strength = 7
      ccards = bucket1.length === 4? bucket1 : bucket2
    } else if (bucket1.length === 3 || bucket2.length === 3) {
      if (bucket1.length === 2) {
        //full house
        strength = 6
      } else if (bucket2.length === 2){
        //full house
        ccards = bucket2.concat(bucket1)
        strength = 6
      } else {
        //three of a kind
        strength = 3
      }
    } else if (bucket1.length === 2 && bucket2.length === 2) {
      //two pairs
      strength = 2
    }

    return {strength, cards: ccards}
  }
}

module.exports = SNAnalyzer