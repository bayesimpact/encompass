import { capitalize } from 'lodash'

/**
 * Like `_.capitalize`, but capitalizes all words in the given sentence
 */
export function capitalizeWords(string: string) {
  return string.split(' ').map(capitalize).join(' ')
}
