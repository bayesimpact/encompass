import { snakeCase } from 'lodash'
import { State } from '../constants/states'

export function serializeServiceArea(state: State, county: string, zip: string) {
  return `${state}_${snakeCase(county)}_${zip}`
}
