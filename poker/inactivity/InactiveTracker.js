const logger = require('log4js').getLogger('Inactivity')
logger.level = 'debug'

class InactiveTracker {
  constructor(timeOutSeconds, gameKicker) {
    this.players = []
    this.counts = Array.from(new Array(this.players.length), () => 0)
    this.gameKicker = gameKicker

    this.idleInterval = setInterval(
      () => this.incrementAll(),
      timeOutSeconds * 1000
    )
  }

  incrementAll() {
    let i = 0
    while (i < this.counts.length) {
      this.counts[i] += 1
      if (this.counts[i] === 4) {
        this.counts.splice(i, 1)
        this.gameKicker(this.players.splice(i, 1)[0])
      } else {
        i += 1
      }
    }
  }

  resetPlayer(playerId) {
    let index = this.players.indexOf(playerId)
    if (index !== -1) {
      this.counts[index] = 0
    }
  }

  join(id) {
    this.players.push(id)
    this.counts.push(0)
  }
}

module.exports = InactiveTracker
