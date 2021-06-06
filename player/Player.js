const Menu = require('../menu/Menu')
const logger = require('log4js').getLogger('jb')
logger.level = 'debug'

class Player extends Menu {
  constructor(context, startingAudio) {
    super(context)
    this.connection = null //currently joined voice channel
    this.dispatcher = null //current dispatcher sending audio
    this.playingTarget = startingAudio // a string (file location, url) of the audio
    this.continue()
  }

  async continue() {
    //join requester's voice channel
    if (this.context.triggerMsg.member.voice.channel) {
      this.connection =
        await this.context.triggerMsg.member.voice.channel.join()

      // Create a dispatcher
      this.dispatcher = this.connection.play(this.playingTarget, {
        volume: 0.8,
      })

      this.dispatcher.on('start', () => {
        this.setDisplayText('playing...')
        this.flush()
        console.log('audio.mp3 is now playing!')
      })

      this.dispatcher.on('finish', () => {
        console.log('audio.mp3 has finished playing!')
        this.setDisplayText('finished playing...')
        this.flush()
        //should set dispatcher to null?
        //connection disconnect timeout setup?
      })

      // Always remember to handle errors appropriately!
      this.dispatcher.on('error', console.error)
    } else {
      this.setDisplayText('You are not in a voice channel.')
      this.flush()
      return
    }
  }
}

module.exports = Player
