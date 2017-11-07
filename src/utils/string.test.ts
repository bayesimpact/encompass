import { capitalizeWords } from './string'

test('capitalizeWords', () => {
  expect(capitalizeWords('')).toBe('')
  expect(capitalizeWords('Foo Bar')).toBe('Foo Bar')
  expect(capitalizeWords('abc')).toBe('Abc')
  expect(capitalizeWords('abc1')).toBe('Abc1')
  expect(capitalizeWords('fooBar')).toBe('Foo Bar')
  expect(capitalizeWords('foo bar')).toBe('Foo Bar')
  expect(capitalizeWords('foo1')).toBe('Foo1')
})
