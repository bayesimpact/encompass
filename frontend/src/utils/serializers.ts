import { State } from '../constants/states'
import { snakeCase } from './string'

export function serializeServiceArea(state: State, county: string, zip: string) {
  return `${state}_${snakeCase(county)}_${zip}`
}
