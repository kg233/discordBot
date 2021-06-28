//Hand evaluator

const { maxCards } = require("../defs");
const SNAnalyzer = require("./SNAnalyzer")
const SQAnalyzer = require("./SQAnalyzer")
const SSAnalyzer = require("./SSAnalyzer")

class HandEvaluator {
  constructor(cards){
    this.cards = cards
  }

  async eval() {
    if (this.cards.length !== maxCards) return;

    const SS = new SSAnalyzer()
    const SQ = new SQAnalyzer()
    const SN = new SNAnalyzer()

    let curStrength = 0
    let curCards = this.top5Rank()

    //step 1
    SS.setCards(this.cards)
    let {strength, cards} = await SS.analyze()

    if (strength > curStrength) {
      curStrength = strength
      curCards = cards

      if (strength === 8 || strength === 9) {
        //straight/royal flush, exit right away
        return {strength: curStrength, cards: curCards}
      }
    }

    //step 2
    //no need to run if flush found since straight < flush
    if (curStrength === 0 ){
      SQ.setCards(this.cards)
      let SQ_res = await SQ.analyze()
      if (SQ_res.strength > curStrength) {
        curStrength = SQ_res.strength
        curCards = SQ_res.cards
      }
    }

    //step 3
    SN.setCards(this.cards)
    let SN_res = await SN.analyze()
    if (SN_res.strength > curStrength) {
      curStrength = SN_res.strength
      curCards = SN_res.cards
    }

    return {strength: curStrength, cards: curCards}

  }

  top5Rank() {
    this.cards.sort((a, b) => a.getRank() - b.getRank())

    return this.cards.slice(2)
  }
}

module.exports = HandEvaluator