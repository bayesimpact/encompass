import { snakeCase } from 'lodash'
import { serializeServiceArea } from './serializers'
import { capitalizeWords } from './string'

/**
 * Formats numbers for display in the UI.
 */
export function formatNumber(n: number) {
  switch (n) {
    case Infinity:
    case -Infinity:
      return '-'
    default:
      return n.toLocaleString()
  }
}

export function formatServiceArea(serializedServiceArea: string) {
  let { county, zip } = parseSerializedServiceArea(serializedServiceArea)
  return `${capitalizeWords(county)} / ${zip}`
}

/**
 * Returns serialized service area.
 *
 * TODO: Is there a way to avoid needing this function?
 */
export function unformatServiceArea(formattedServiceArea: string): string {
  let { county, state, zip } = parseFormattedServiceArea(formattedServiceArea)
  return serializeServiceArea(state, county, zip)
}

function parseFormattedServiceArea(formattedServiceArea: string) {
  let [c, z] = formattedServiceArea.split(' / ')
  return {
    county: snakeCase(c),
    state: 'ca' as 'ca',
    zip: z
  }
}

function parseSerializedServiceArea(serializedServiceArea: string) {
  return {
    county: serializedServiceArea.slice(3, -6),
    state: serializedServiceArea.slice(0, 2),
    zip: serializedServiceArea.slice(-5)
  }
}
