import { findKey } from 'lodash'
import { State } from '../constants/states'
import { snakeCase } from './string'

export function serializeServiceArea(state: State, county: string, zip: string) {
  return `${state}_${snakeCase(county)}_${zip}`
}

export function getPropCaseInsensitive<T extends Object>(obj: T, name: string): T[keyof T] {
  let realName = findKey(obj, function (_value, key: string) {
    return snakeCase(key).toLowerCase() === name.toLowerCase()
  }) || 'no_key'
  return obj[realName as keyof T]
}
