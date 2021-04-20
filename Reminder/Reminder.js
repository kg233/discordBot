//Reminder.js
//initialize: set up and read from a DB(.txt? firebase?) of dates and remind messages. Need to keep track the server & channel id & user

//set a interval callback that will check every (24hr), and if date match one of the reminders, trigger that reminder
const { MessageEmbed } = require('discord.js')
const firebase = require('firebase/app')
const firebaseConfig = require('../firebaseKeys.json')
const { msToHMS } = require('../util/dateTime')
require('firebase/database')
const logger = require('log4js').getLogger('reminder')
logger.level = 'debug'

const gapMs = 3600 * 1000
const remindRange = 3600 * 1000

class Reminder {
  static instance = null

  constructor() {
    if (Reminder.instance) {
      logger.error(
        'Reminder object already exists, call getInstance() instead.'
      )
      return
    }
    this.refetch = false
    firebase.initializeApp(firebaseConfig)
    this.database = firebase.database()

    logger.info('reminder initialized')
  }

  static getInstance() {
    if (Reminder.instance === null) {
      Reminder.instance = new Reminder()
    }
    return Reminder.instance
  }

  getReminders() {
    const dbRef = firebase.database().ref()
    return dbRef
      .child('reminders')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          logger.debug('reminder database found')
        } else {
          logger.warn('No data available')
        }
        return snapshot.val()
      })
      .catch((error) => {
        logger.error(error)
      })
  }

  run = async () => {
    if (this.refetch || !this.snapshot) {
      logger.debug('updating to a fresh snapshot')
      this.snapshot = await this.getReminders()
    }

    logger.debug('snapshot update complete')

    if (this.snapshot) {
      logger.info('checking for events about to happen')
      await this.checkAndMessage()
      logger.info('done checking')
    }
  }

  async checkAndMessage() {
    const snapshot = this.snapshot
    const nowMs = new Date().getTime()
    for (let userId of Object.keys(snapshot)) {
      for (let dateMs of Object.keys(snapshot[userId])) {
        if (dateMs >= nowMs && Math.abs(dateMs - nowMs) < remindRange) {
          const context = snapshot[userId][dateMs]
          await this.client.channels.cache.get(context.channel).send(
            `<@${userId}> `,
            new MessageEmbed({
              description: `${context.message}`,
              timestamp: new Date(parseInt(dateMs)).toISOString(),
              title: `In ${msToHMS(Math.abs(dateMs - nowMs))}`,
            })
          )
        } else if (dateMs < nowMs) {
          //delete this from database
          logger.debug('removing event ' + `/${userId}/${dateMs}`)
          await this.database
            .ref('reminders')
            .child(userId)
            .child(dateMs)
            .remove()
        }
      }
    }
  }
  attachClientAndStart(client) {
    logger.debug('attaching client..')
    this.client = client
    this.run()

    setInterval(this.run, gapMs)
  }

  addReminder = async (userId, message, time, channel) => {
    if (!userId || !message || !time || !channel) {
      logger.warn('parameters not satisfied')
      return
    }
    const dbRef = firebase.database().ref('reminders')
    if (!dbRef) {
      logger.warn('dbRef does not exist')
      return 0
    }

    // dbRef.once(userId, (ss) => {
    //   if (ss.val() === null){

    //   }
    //   else{

    //   }
    //   this.refetch = true
    // })

    const reminderData = {
      message,
      channel,
    }

    const updates = {}
    updates['/' + userId + '/' + time] = reminderData

    dbRef.update(updates)
    this.refetch = true
    return 1
  }
}

module.exports = Reminder
