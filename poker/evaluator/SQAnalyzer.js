//Sequence Analyzer

const Analyzer = require('./Analyzer')


const logger = require('log4js').getLogger('SQAnalyzer')
logger.level = 'debug'

class SQAnalyzer extends Analyzer {
  constructor() {
    super()
  }

  sort(cards) {
    cards.sort((a, b) => a.getRank() - b.getRank())
  }

  async check() {
    const cards = this.cards
    //list that holds the potential straights
    let resultSet = []

    if (cards[cards.length - 1].getRank() === 12) {
      resultSet.push(cards[cards.length - 1])
    }

    for (let card of cards) {
      if (resultSet.length === 0) {
        resultSet.push(card)
        continue
      }
      const prevRank = resultSet[resultSet.length - 1].getRank()
      const cardRank = card.getRank()
      if (cardRank === 2 && prevRank === 12) {
        resultSet.push(card)
      } else if (cardRank - prevRank === 1) {
        resultSet.push(card)
      }
      else {
        if (resultSet.length < 5) {
          resultSet = []
          resultSet.push(card)
        } else {
          break
        }
      }
    }

    if (resultSet.length >= 5) {
      resultSet.splice(0, resultSet.length - 5)
      return {strength: 4, cards: resultSet};
    }

    return {strength: 0, cards: []};
  }

}


module.exports = SQAnalyzer