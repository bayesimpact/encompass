import { chain } from 'lodash'

export function lazy<T>(a: T) {
  return chain(a)
}
