const Menu = require('../menu/Menu')
const Dealer = require('./dealer/Dealer')
const { MIN_PLAYER_TO_START, ROUND_FINISHED } = require('./defs')
const RoundPoker = require('./RoundPoker')
const { prefix: PREFIX } = require('./../prefix.json')
const InactiveTracker = require('./inactivity/InactiveTracker')

const logger = require('log4js').getLogger('Game')
logger.level = 'debug'

class PokerGame extends Menu {
  constructor(context) {
    super(context)
    this.players = []
    this.dealer = new Dealer()
    this.discordClient = context.client
    this.setDisplayText('new poker game created')
    this.flush()
    this.inactiveTracker = new InactiveTracker(1, this.kick)
  }

  join(id) {
    if (!this.players.includes(id)) {
      this.inactiveTracker.join(id)

      logger.info(`player ${id} joined the game!`)
      this.players.push(id)
      this.setDisplayText(`<@${id}> has joined the game!`)
      this.flush()
    }
  }

  leave(id) {
    const ind = this.players.indexOf(id)
    if (ind === -1) return
    const temp = this.players.splice(ind, 1)
    logger.info(`player ${temp} has quit the game!`)
  }

  startNewRound(requestingPlayer) {
    if (requestingPlayer && !this.players.includes(requestingPlayer)) {
      this.setDisplayText(
        'You cannot start the game if you are not apart of it' +
          ', join the game with ' +
          PREFIX +
          'poker join'
      )
      this.flush()
      return
    }

    if (this.round && this.round.stage != ROUND_FINISHED) {
      return
    }

    if (this.players.length >= MIN_PLAYER_TO_START) {
      this.round = new RoundPoker(this.context, [...this.players], this.dealer)
      return
    }
    this.setDisplayText(
      'Not enough players, minimum: ' +
        MIN_PLAYER_TO_START +
        ', join the game with ' +
        PREFIX +
        'join'
    )
    this.flush()
  }

  handlePlayerAction(playerId, action) {
    this.inactiveTracker.resetPlayer(playerId)
    this.round.handlePlayerAction(playerId, action)
  }

  kick = (playerId) => {
    const ind = this.players.indexOf(playerId)
    if (ind !== -1) {
      logger.info(`${playerId} kicked for inactivity`)
      this.players.splice(ind, 1)
      this.round && this.round.handlerPlayerFold(playerId)
    }
  }
}

module.exports = PokerGame
