import { snakeCase } from 'lodash'

export function serializeServiceArea(state: 'ca', county: string, zip: string) {
  return `${state}_${snakeCase(county)}_${zip}`
}
