import { chain, keyBy } from 'lodash'
import { Adequacies, Adequacy, Provider, RepresentativePoint } from '../constants/datatypes'

type ReduceNumberFn = (acc: number, current: number, index: number, array: number[]) => number

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
let reduce = (initial: number) =>
  (f: ReduceNumberFn) =>
    <T>(g: (a: T) => number) =>
      (data: T[]) =>
        chain(data)
          .map(g)
          .reduce(f, initial)
          .round()
          .value()

let mean = (a: number, b: number, index: number, array: number[]) => a + b / array.length
let max = (a: number, b: number) => Math.max(a, b)
let min = (a: number, b: number) => Math.min(a, b)
let sum = (a: number, b: number) => a + b

export let averageDistance = reduce(0)(mean)<Adequacy>(_ => _.distanceToClosestProvider)
export let maxDistance = reduce(-Infinity)(max)<Adequacy>(_ => _.distanceToClosestProvider)
export let minDistance = reduce(Infinity)(min)<Adequacy>(_ => _.distanceToClosestProvider)

export let averageTime = reduce(0)(mean)<Adequacy>(_ => _.timeToClosestProvider)
export let maxTime = reduce(-Infinity)(max)<Adequacy>(_ => _.timeToClosestProvider)
export let minTime = reduce(Infinity)(min)<Adequacy>(_ => _.timeToClosestProvider)

export let population = reduce(0)(sum)<RepresentativePoint>(_ => _.population)
