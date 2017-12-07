import { capitalizeWords, fuzz } from './string'

test('capitalizeWords', () => {
  expect(capitalizeWords('')).toBe('')
  expect(capitalizeWords('Foo Bar')).toBe('Foo Bar')
  expect(capitalizeWords('abc')).toBe('Abc')
  expect(capitalizeWords('abc1')).toBe('Abc1')
  expect(capitalizeWords('fooBar')).toBe('Foo Bar')
  expect(capitalizeWords('foo bar')).toBe('Foo Bar')
  expect(capitalizeWords('foo_bar')).toBe('Foo Bar')
  expect(capitalizeWords('foo1')).toBe('Foo1')
})

test('fuzz', () => {
  expect(fuzz('abc def')).toBe('abcdef')
  expect(fuzz('ABC DEF')).toBe('abcdef')
  expect(fuzz('ABC  def')).toBe('abcdef')
})
