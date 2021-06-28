const Menu = require('../menu/Menu')
const Dealer = require('./dealer/Dealer')
const { MIN_PLAYER_TO_START } = require('./defs')
const RoundPoker = require('./RoundPoker')

const logger = require('log4js').getLogger('Game')
logger.level = 'debug'

class PokerGame extends Menu{
  constructor(context){
    super(context)
    this.players = []
    this.dealer = new Dealer()
    this.discordClient = context.client
    this.setDisplayText("new poker game created")
    this.flush()
  }

  join(id) {
    if (!this.players.includes(id)) {
      logger.info(`player ${id} joined the game!`)
      this.players.push(id)
    }
  }

  leave(id) {
    const ind = this.players.indexOf(id)
    if (ind === -1) return
    const temp = this.players.splice(ind, 1)
    logger.info(`player ${temp} has quit the game!`)
  }

  startNewRound() {
    if (this.players.length >= MIN_PLAYER_TO_START) {
      this.round = new RoundPoker(this.context, this.players, this.dealer)
    }
    this.setDisplayText("Not enough players, minimum: " + MIN_PLAYER_TO_START)

  }

  handlePlayerAction(playerId, action) {
    this.round.handlePlayerAction(playerId, action)
  }


}

module.exports = PokerGame