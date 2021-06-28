//Same Suit Analyzer


const logger = require('log4js').getLogger('SSAnalyzer')
logger.level = 'debug'

const Analyzer = require('./Analyzer')
const SQAnalyzer = require("./SQAnalyzer")

class SSAnalyzer extends Analyzer {
  constructor() {
    super()
  }

  sort(cards) {
    cards.sort((a, b) => a.getSuit() - b.getSuit())
  }

  async check() {
    const cards = this.cards

    let currSuit = 0
    let cnt = 0
    let resultSet = []

    for (let card of cards) {
      if (card.getSuit() != currSuit) {
        if (cnt >= 5) {
          break
        }
        currSuit = card.getSuit()
        cnt = 1
        resultSet = [card]
      } else {
        cnt += 1;
        resultSet.push(card)
      }
    }

    if (resultSet.length >= 5) {
      let strength = 5

      const SQA = new SQAnalyzer()
      SQA.setCards(resultSet)

      let SQA_res = await SQA.check()
      if (SQA_res.cards.length !== 0) {
        //we either have a royal flush or straight flush

        for (let card of cards) {
          logger.debug(card.toString())
        }

        if (SQA_res.cards[4].getRank() === 12) {
          strength = 9
        } else {
          strength = 8
        }
      }

      //can do this because its sorted in SQAnalyzer.setCards()
      resultSet.splice(0, resultSet.length - 5)
      return {strength, cards: resultSet}
    } else {
      return {strength: 0, cards: []}
    }
  }
}

module.exports = SSAnalyzer