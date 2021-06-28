const Menu = require("../menu/Menu")
const Cards = require("./card/Cards")
const { ROUND_START, BLIND_BET_ROUND, SHOW_DOWN_ROUND, RIVER_BET_ROUND, pokerCombinations } = require("./defs")
const { prefix: PREFIX } = require('./../prefix.json')

const logger = require('log4js').getLogger('Round')
logger.level = 'debug'

class RoundPoker extends Menu {
  constructor(context, players, dealer) {
    super(context)
    this.discord = context.client
    this.players = players
    this.currPlayer = 0
    this.hands = new Array(players.length)
    this.betAmount = Array.from(new Array(this.players.length), _ => 0)
    this.prizePool = 0
    this.communityCards = []
    this.stage = ROUND_START
    this.dealer = dealer
    this.dealer.shuffle()
    this.dealHoleCards()
  }

  dealHoleCards() {
    for (let i = 0; i < this.players.length; i ++){
      const hand = []
      hand.push(this.dealer.deal(true), this.dealer.deal(true))
      this.hands[i] = hand

      this.sendPrivMessage(`your hand: ${new Cards(hand).toString()}`, this.players[i])
    }   

    this.setState(BLIND_BET_ROUND)
    this.startBetRound()
  }

  startBetRound() {
    this.currPlayer = 0
    this.sendBetRequest(this.players[this.currPlayer])
  }

  handlePlayerAction(playerId, action) {
    if (playerId !== this.players[this.currPlayer]) return
    if (action === "check") {
      this.handlePlayerCheck(playerId)
    } else {
      this.sendMessage("还没写完呢臭傻逼, try again", playerId)
    }
  }

  handlePlayerCheck(playerId) {
    logger.debug(`player ${this.players[playerId]} has checked`)
    if (this.currPlayer !== this.players.length - 1) {
      this.currPlayer += 1
      this.sendBetRequest(this.currPlayer)
    } else {
      this.addCommunityCardsForStage()
    }
  }

  addCommunityCardsForStage() {
    if (this.stage === BLIND_BET_ROUND) {
      this.addCommCards(3)
    }
    else if (this.stage !== RIVER_BET_ROUND) {
      this.addCommCards(1)
    }

    this.displayCommCards()
    this.nextStage()
    this.handleStage()
  }

  handleStage() {
    if (this.stage !== SHOW_DOWN_ROUND) {
      this.startBetRound()
    } else {
      //handle showdown
      this.showdownCompare()
    }
  }

  async showdownCompare() {
    this.currPlayer = -1

    const str_list = []

    for (let i = 0; i < this.players.length; i ++) {
      const cards = new Cards(this.hands[i].concat(this.communityCards))
      await cards.evaluate()
      
      this.hands[i] = cards
      str_list.push(this.hands[i].strength) 
    }

    logger.debug("str_list: " + str_list)

    let highest = 0
    let ties = []
    for (let i = 0; i < this.players.length; i++) {
      if (str_list[i] > highest) {
        highest = str_list[i]
        ties = [i]

      } else if (str_list[i] === highest) {
        ties.push(i)
      }
    }

    logger.debug("tie list: " + ties)

    if (ties.length > 1) {
      this.announceWinner(this.handleTies(ties))
    }

    this.announceWinner(ties[0])
  }

  handleTies(tieIndexes) {
    //todo: handle all card the same rank tie
    let cur_index = 0
    let t1 = this.hands[tieIndexes[0]]
    let t2
    for (let i = 1; i < tieIndexes.length; i++) {
      t2 = tieIndexes[i]
      if (this.compareHands(t1, t2)) {
        t1 = t2
        cur_index = i
      }
    }
    return cur_index
  }

  announceWinner(ind) {
    logger.debug(`${ind} won`)
    this.sendMessage(`Won with ${pokerCombinations[this.hands[ind].strength]}: ${this.hands[ind].getCombo()}`, this.players[ind])
  }

  compareHands(t1, t2) {
    //-1 : t1 bigger
    //1: t2 bigger
    //0: tie
    let h1 = t1.getCombo()
    let h2 = t2.getCombo()

    h1.sort((a, b) => b.getRank() - a.getRank())
    h2.sort((a, b) => b.getRank() - a.getRank())
    for (let i = 0; i < h1.length; i++) {
      if (h1[i].getRank() > h2[i].getRank()) {
        return -1
      } else if (h1[i].getRank() < h2[i].getRank()) {
        return 1
      }
    }
    return 0
  }

  addCommCards(t) {
    for (let i = 0; i < t; i ++) {
      this.communityCards.push(this.dealer.deal()) 
    }
  }

  displayCommCards() {
    this.sendMessage(this.communityCards.toString(), null, true) 
  }

  setState(stage) {
    this.stage = stage
  }

  nextStage() {
    this.stage += 1
    logger.debug("poker stage: " + this.stage)
  }

  sendBetRequest(playerId) {
    this.sendMessage(`check (${PREFIX}check), bet (${PREFIX}bet ###), or fold (${PREFIX}fold)`, playerId)
  }

  sendMessage(message, playerId, asCode = false) {
    this.setDisplayText(playerId? `<@${playerId}>, ` + message : message)
    this.flush(asCode)
  }

  sendPrivMessage(message, playerId) {
    this.discord.users.cache.get(playerId).send(message, {code: true})
  }

}



module.exports = RoundPoker