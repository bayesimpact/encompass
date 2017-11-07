import { capitalize, memoize } from 'lodash'

/**
 * Like `_.capitalize`, but capitalizes all words in the given sentence
 * and splits camelcased words.
 */
export let capitalizeWords = memoize((string: string) =>
  string
    .replace(/([^A-Z ])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(capitalize)
    .join(' ')
)
