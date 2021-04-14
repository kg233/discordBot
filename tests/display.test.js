const Display = require('../menu/display')

test('display can generate text', () => {
  const testString = 'hello123\n321'
  const dp = new Display(testString)
  expect(dp.generateAsText()).toBe(testString)
})

test('empty string given to display will not crash', () => {
  const testString = ''
  const dp = new Display(testString)
  expect(dp.generateAsText()).toBe(testString)
})
