const logger = require('log4js').getLogger('menu')
logger.level = 'debug'
const Menu = require('../menu/Menu')
const { isGoodDate, isGoodTime } = require('../util/dateTime')
const { prefix: PREFIX } = require('./../prefix.json')
const Reminder = require('./Reminder')

class ReminderCommand extends Menu {
  constructor(context) {
    super(context)
    this.continue()
  }

  continue = async () => {
    const params = this.parseTrigger(this.context.triggerMsg)
    if (!params) {
      this.setDisplayText(
        `syntax #1: ${PREFIX}remind MM-DD-YY[r] [HH:MM[r]] {message}`
      )
      this.flush()
      return
    }

    const suc = await Reminder.getInstance().addReminder(
      this.context.triggerMsg.author.id,
      params.message,
      params.dateMs,
      this.context.triggerMsg.channel.id,
      params.repeatMonth,
      params.repeatDay
    )
    if (suc) {
      this.setDisplayText('Success')
      this.flush(true, {
        title: params.repeatDay
          ? 'Repeats daily'
          : params.repeatMonth
          ? 'Repeats monthly'
          : undefined,
        description: `${params.message}`,
        timestamp: new Date(params.dateMs).toISOString(),
      })
    } else {
      this.setDisplayText('Failed')
      this.flush(true)
    }
  }

  parseTrigger = (msg) => {
    //parse for date in ms, message
    //syntax #1: ${PREFIX}remind MM-DD-YY[r] [HH:MM[r]] {message}
    //syntax #2: "<PREFIX>remind in # message"
    //how to account for users time zone? default to utc for now, discord doesn't expose the users timezone,

    let date
    let message
    let repeatMonth = false
    let repeatDay = false
    const split = msg.content.split(' ')

    if (split[1] === 'in') {
      if (split.length < 4 || Object.is(parseInt(split[2]), NaN)) {
        return null
      }

      date = new Date()
      date.setHours(date.getHours() + parseInt(split[2]))
      message = split.splice(3).join(' ')
    } else {
      if (split.length < 3 || !isGoodDate(split[1])) {
        return null
      }

      date = split[1]
      if (date[date.length - 1] === 'r') {
        date = date.slice(0, date.length - 1)
        repeatMonth = true
      }
      date = new Date(date)
      let time = split[2]
      if (isGoodTime(time)) {
        if (time[time.length - 1] === 'r') {
          time = time.slice(0, time.length - 1)
          repeatMonth = false
          repeatDay = true
        }
        date.setHours(time.split(':')[0])
        date.setMinutes(time.split(':')[1])
        message = split.splice(3).join(' ')
      } else {
        date.setHours(12)
        message = split.splice(2).join(' ')
      }
    }
    return { dateMs: date.getTime(), message, repeatMonth, repeatDay }
  }
}

module.exports = ReminderCommand
