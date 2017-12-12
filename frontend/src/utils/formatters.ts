import { snakeCase } from 'lodash'
import { serializeServiceArea } from './serializers'
import { capitalizeWords } from './string'

/**
 * Formats coordinates for display in the UI.
 */
export function formatCoordinate(n: number) {
  if (Number.isNaN(n)) {
    return '-'
  }
  return n.toFixed(4).toLocaleString()
}

/**
 * Formats numbers for display in the UI.
 */
export function formatNumber(n: number) {
  switch (n) {
    case Infinity:
    case -Infinity:
      return '-'
    default:
      if (Number.isNaN(n)) {
        return '-'
      }
      return n.toLocaleString()
  }
}

/**
 * Formats percentage number for display in the UI.
 */
export function formatPercentage(n: number) {
  if (Number.isNaN(n)) {
    return '-'
  }
  return n.toFixed(2).toLocaleString() + '%'
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
export function unformatServiceArea(state: string, formattedServiceArea: string): string {
  let { county, zip } = parseFormattedServiceArea(formattedServiceArea)
  return serializeServiceArea(state, county, zip)
}

function parseFormattedServiceArea(formattedServiceArea: string) {
  let [c, z] = formattedServiceArea.split(' / ')
  return {
    county: snakeCase(c),
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
