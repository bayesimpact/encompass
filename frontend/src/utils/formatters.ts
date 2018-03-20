import { State } from '../constants/states'
import { serializeServiceArea } from './serializers'
import { capitalizeWords, snakeCase } from './string'

/**
 * Converts 9-digit ZIP Codes (ZIP+4 codes) to 5-digit codes.
 */
export function normalizeZip(zipCode: string) {
  return zipCode.split('-')[0]
}

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
      return n.toFixed(0).toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

/**
 * Formats numbers with 'K' for thousands, 'M' for millions for axis labels.
 */
export function formatAxisNumber(n: number) {
  if (n >= 1000000) {
      return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (n >= 1000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return n
}


/**
 * Formats percentage number for display in the UI.
 */
export function formatPercentage(n: number, decimal?: number) {
  if (Number.isNaN(n)) {
    return '-'
  }
  return n.toFixed(decimal != null ? decimal : 2).toLocaleString() + '%'
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
export function unformatServiceArea(state: State, formattedServiceArea: string): string {
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

export function parseSerializedServiceArea(serializedServiceArea: string) {
  return {
    county: serializedServiceArea.slice(3, -6),
    state: serializedServiceArea.slice(0, 2) as State,
    zip: serializedServiceArea.slice(-5)
  }
}
