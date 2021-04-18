const Loading = require('../Loading/Loading')
const Menu = require('../menu/Menu')
const fs = require('fs')
const Mutex = require('async-mutex').Mutex
const logger = require('log4js').getLogger('jb')
logger.level = 'debug'
const mutex = new Mutex()

class Jb extends Menu {
  static #displayTime = 3000 //ms

  constructor(context) {
    super(context)
    this.context = context
    this.setDisplayText(fs.readFileSync('./jb/jb.txt', 'utf-8'))
    this.loader = null
    this.msg = null
    this.running = false
    this.continue()
  }

  async continue() {
    this.running = true
    //sets up loading
    this.loader = new Loading(this.context)
    await new Promise((r) => setTimeout(r, 1500 * 9))
    //
    const release = await mutex.acquire()
    try {
      if (this.running) {
        this.loader.save()
        //display
        this.msg = await super.flush(false)
        //
        await new Promise((r) => setTimeout(r, 3000))
        //delete
        this.running && this.msg.delete()
        this.running = false
      }
    } finally {
      release()
    }
  }

  async save() {
    if (!this.running) return
    super.save()

    const release = await mutex.acquire()
    try {
      this.running = false
      this.msg && this.msg.delete()
      this.loader && this.loader.save()
    } finally {
      release()
    }
  }
}

module.exports = Jb
