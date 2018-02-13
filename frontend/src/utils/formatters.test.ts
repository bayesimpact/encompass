import { normalizeZip } from './formatters'

test('normalizeZip', () => {
    expect(normalizeZip('')).toBe('')
    expect(normalizeZip('12345')).toBe('12345')
    expect(normalizeZip('12345-6789')).toBe('12345')
})
