import { equals } from './list'

test('equals', () => {
  expect(equals([], [])).toBe(true)
  expect(equals([1], [1])).toBe(true)
  expect(equals(['a', 'b'], ['a', 'b'])).toBe(true)
  expect(equals([['a'], ['b']], [['a'], ['b']])).toBe(true)
  expect(equals([{ a: [1], b: [2] }], [{ a: [1], b: [2] }])).toBe(true)
  expect(equals([{ a: () => 1 }], [{ a: () => 2 }])).toBe(true)

  expect(equals([], [1])).toBe(false)
  expect(equals([1], [])).toBe(false)
  expect(equals(['a', 'b'], ['b', 'a'])).toBe(false)
  expect(equals(['a', 'b'], ['a'])).toBe(false)
})
