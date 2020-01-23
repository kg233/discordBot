const ytdl = require('ytdl-core')

class Player {
  constructor(message, connection) {
    this.message = message
    this.connection = connection
    this.dispatch = null
    this.paused = false
    this.end = false
  }

  async start() {
    this.message.edit('playing', { code: true }).then(msg => {
      msg.react('⏯️').then(rct => {
        rct.message.react('⏹️')
      })
    })
    this.dispatch = this.connection.playStream(
      ytdl('https://www.youtube.com/watch?v=V8RwHXUtCcw', {
        filter: 'audioonly',
      })
    )
  }

  handle(emojiUNI) {
    if (this.end) {
      return
    }
    if (emojiUNI === '⏹️') {
      this.message.edit('stopped', { code: true })
      this.end = true
      this.dispatch.end()
      this.connection.disconnect()
    } else if (emojiUNI === '⏯️') {
      if (this.paused) {
        this.message.edit('playing', { code: true })
        this.dispatch.resume()
        this.paused = false
      } else {
        this.message.edit('paused', { code: true })
        this.dispatch.pause()
        this.paused = true
      }
    }
  }
}

module.exports = Player
