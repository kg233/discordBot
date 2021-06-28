const { pokerRanks, pokerSuits } = require("../defs")

//Card
class Card {
  constructor(rank, suit, isHand) {
    this.rank = rank
    this.suit = suit
    this.isHand = isHand
  }

  getRank() {
    return this.rank
  }

  getSuit() {
    return this.suit
  }

  toString() {
    return pokerRanks[this.rank] + pokerSuits[this.suit];
  }
}

module.exports = Card