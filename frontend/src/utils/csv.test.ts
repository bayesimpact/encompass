import { isEmpty } from './csv'

test('isEmpty', () => {
  expect(isEmpty(null)).toBe(true)
  expect(isEmpty(undefined)).toBe(true)
  expect(isEmpty('')).toBe(true)
  expect(isEmpty('   ')).toBe(true)
  expect(isEmpty('1')).toBe(false)
  expect(isEmpty('  a  ')).toBe(false)
})
