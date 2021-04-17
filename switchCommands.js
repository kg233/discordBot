const { prefix: PREFIX } = require('./prefix.json')
const fs = require('fs')
const Reader = require('./Reader/Reader')
let { invokes } = require('./index')

function saveOldStatefulFor(requester) {
  if (invokes.has(requester)) {
    //do save on previous stateful invoke is there is one
    invokes.get(requester).save && invokes.get(requester).save()
  }
}

function switchCommands(context) {
  const command = context.triggerMsg.content
  const requester = context.triggerMsg.author.id
  if (command.startsWith(PREFIX + 'ping')) {
    //stateless invoke, replace directly
    saveOldStatefulFor(requester)

    const invoke = new Reader(
      context,
      fs.readFileSync('./Reader/default.txt', 'utf-8')
    )
    invokes.set(requester, invoke)
  }
}

module.exports = switchCommands
