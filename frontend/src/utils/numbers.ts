export function maybeParseFloat(string: string | null) {
  if (string == null) {
    return undefined
  }
  let float = parseFloat(string)
  if (Number.isNaN(float)) {
    return undefined
  }
  return float
}

/**
* Convenience function for rounding without using toFixed (which is for formatting).
*/
export function precisionRound(number: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}
