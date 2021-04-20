function msToHMS(ms) {
  // 1- Convert to seconds:
  var seconds = ms / 1000
  // 2- Extract hours:
  var hours = parseInt(seconds / 3600) // 3,600 seconds in 1 hour
  seconds = seconds % 3600 // seconds remaining after extracting hours
  // 3- Extract minutes:
  var minutes = parseInt(seconds / 60) // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60
  return hours
    ? hours + ' hours, ' + minutes + ' minutes'
    : '' + minutes + ' minutes'
}

function isGoodDate(dt) {
  var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
  return reGoodDate.test(dt)
}

function isGoodTime(dt) {
  var reGoodTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return reGoodTime.test(dt)
}

module.exports = { msToHMS, isGoodDate, isGoodTime }
