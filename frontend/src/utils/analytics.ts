import { identity } from 'lodash'
import { Adequacy, CensusGroup, RepresentativePoint } from '../constants/datatypes'

/**
 * A big generic partially appliable reducer for building math pipelines.
 *
 * It accepts an `initial` value, a reducer `f`, a plucker `g` that
 * takes an object of type `T` and gives a numerical property on it,
 * and an array of `data`. We take advantage of Lodash's loop fusion
 * to do a map and reduce in *O(n)* time.
 *
 * We round the result, because floating point math is not always
 * accurate (.1 + .2 === 0.30000000000000004).
 */
let fold = <T>(initial: T) =>
  (f: FoldFn<T>) =>
    <U>(g: (a: U) => T = identity) =>
      (data: Lazy<U[]>) =>
        data
          .map(g)
          .reduce(f, initial)
          .round()
          .value()

type FoldFn<T, U = T> = (acc: U, current: T, index: number, array: T[]) => U

let fns = {
  mean: (a: number, b: number, _index: number, array: number[]) => a + b / array.length,
  max: (a: number, b: number) => Math.max(a, b),
  min: (a: number, b: number) => Math.min(a, b),
  sum: (a: number, b: number) => a + b
}

let mean = fold(0)(fns.mean)
let max = fold(-Infinity)(fns.max)
let min = fold(Infinity)(fns.min)
let sum = fold(0)(fns.sum)

export let averageMeasure = mean<Adequacy>(_ => _.toClosestProvider)
export let maxMeasure = max<Adequacy>(_ => _.toClosestProvider)
export let minMeasure = min<Adequacy>(_ => _.toClosestProvider)

export let totalPopulation = sum<RepresentativePoint>(_ => _.population)

export function populationByCensus(censusGroup: CensusGroup) {
  return sum<RepresentativePoint>(
    _ => _.population * 0.01 * _.demographics[censusGroup.censusCategory][censusGroup.censusGroup] || 0
  )
}
