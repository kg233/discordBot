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
        `syntax #1: ${PREFIX}remind MM-DD-YY HH:MM message          //HH:MM is optional\nsyntax #2: ${PREFIX}remind in # message`
      )
      this.flush()
      return
    }

    const suc = await Reminder.getInstance().addReminder(
      this.context.triggerMsg.author.id,
      params.message,
      params.dateMs,
      this.context.triggerMsg.channel.id
    )
    if (suc) {
      this.setDisplayText('Success')
      this.flush(true, {
        description: `${params.message} on `,
        timestamp: new Date(params.dateMs).toISOString(),
      })
    } else {
      this.setDisplayText('Failed')
      this.flush(true)
    }
  }

  parseTrigger = (msg) => {
    //parse for date in ms, message
    //syntax #1: "<PREFIX>remind MM/DD/YY {HH:MM} message" {} is optional
    //syntax #2: "<PREFIX>remind in # message"
    //how to account for users time zone? default to utc for now, discord doesn't expose the users timezone,

    const split = msg.content.split(' ')
    if (split[1] === 'in') {
      if (split.length < 4 || Object.is(parseInt(split[2]), NaN)) {
        return null
      }

      const date = new Date()
      date.setHours(date.getHours() + parseInt(split[2]))
      return { dateMs: date.getTime(), message: split.splice(3).join(' ') }
    } else {
      if (split.length < 3 || !isGoodDate(split[1])) {
        return null
      }
      const date = new Date(split[1])
      if (isGoodTime(split[2])) {
        date.setHours(split[2].split(':')[0])
        date.setMinutes(split[2].split(':')[1])

        return { dateMs: date.getTime(), message: split.splice(3).join(' ') }
      } else {
        date.setHours(12)
        return { dateMs: date.getTime(), message: split.splice(2).join(' ') }
      }
    }
  }
}

module.exports = ReminderCommand
