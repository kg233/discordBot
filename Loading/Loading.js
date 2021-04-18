const Menu = require('../menu/Menu')
const Mutex = require('async-mutex').Mutex
const mutex = new Mutex()

const logger = require('log4js').getLogger('load_animate')
logger.level = 'debug'

class Loading extends Menu {
  constructor(context) {
    super(context)
    this.animationFrames = [
      '8D',
      '8=D',
      '8==D',
      '8===D',
      '8====D',
      '8=====D',
      '8======D',
      '8=======D',
    ]
    this.frameCounter = 0
    this.running = false
    this.refreshFrame()
    this.flush().then(() => this.run())
  }

  async animate() {
    while (this.running) {
      await new Promise((r) => setTimeout(r, 1500))
      if (this.frameCounter === this.animationFrames.length - 1) {
        this.frameCounter = 0
      } else {
        this.frameCounter++
      }

      this.refreshFrame()

      this.flush()
    }
  }

  refreshFrame() {
    this.setDisplayText(
      'Loading...\n' + this.animationFrames[this.frameCounter]
    )
  }

  async flush() {
    const release = await mutex.acquire()
    try {
      if (this.msg) {
        //do edit
        this.edit()
      } else {
        this.msg = await super.flush(true)
      }
    } finally {
      release()
    }
  }

  async edit() {
    await this.msg.edit(this.display.generateAsText(), { code: true })
  }

  run() {
    this.running = true
    this.animate()
  }

  stop() {
    this.running = false
  }

  save() {
    super.save()
    this.stop()
  }

  continue() {
    this.msg = null
    this.run()
  }
}

module.exports = Loading
