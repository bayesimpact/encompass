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
