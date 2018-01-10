import { capitalize, memoize, snakeCase as snake_case } from 'lodash'

/**
 * Like `_.capitalize`, but capitalizes all words in the given sentence
 * and splits camelcased words.
 */
export let capitalizeWords = memoize((string: string) =>
  string
    .replace(/([^A-Z ])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .split(' ')
    .map(capitalize)
    .join(' ')
)

export let snakeCase = memoize((string: string) =>
  snake_case(string.toLowerCase())
)

/**
 * Useful for fuzzy comparisons.
 */
export let fuzz = memoize((s: string) =>
  s.toLowerCase().replace(/ /g, '')
)
