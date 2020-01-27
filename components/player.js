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

    let filePath = __dirname + '/../audio/' + 'sabi3.mp3'
    let correctPath = ''

    for (let char = 0; char < filePath.length; char++) {
      if (filePath[char] === '\\') {
        correctPath += '/'
      } else {
        correctPath += filePath[char]
      }
    }

    console.log(correctPath)
    this.dispatch = this.connection.playFile(correctPath)

    this.dispatch.on('end', () => {
      this.end = true
      this.message.edit('stopped', { code: true })
      this.connection.disconnect()
    })
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
