/**
 * Quick and dirty comparison to check whether 2 lists are equal.
 */
export function equals<T>(a: T[], b: T[]) {
  return JSON.stringify(a) === JSON.stringify(b)
}
