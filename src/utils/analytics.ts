import { chain, keyBy } from 'lodash'
import { Adequacies, Adequacy, Provider, RepresentativePoint } from '../constants/datatypes'

type ReduceNumberFn = (acc: number, current: number, index: number, array: number[]) => number

let reduce = (initial: number) =>
  <T>(f: ReduceNumberFn) =>
    (g: (a: T) => number) => (data: T[]) =>
      chain(data)
        .map(g)
        .reduce(f, initial)
        .round()
        .value()

let average = (a: number, b: number, index: number, array: number[]) => a + b / array.length
let max = (a: number, b: number) => Math.max(a, b)
let min = (a: number, b: number) => Math.min(a, b)
let sum = (a: number, b: number) => a + b

export let averageDistance = reduce(0)<Adequacy>(average)(_ => _.distanceToClosestProvider)
export let maxDistance = reduce(-Infinity)<Adequacy>(max)(_ => _.distanceToClosestProvider)
export let minDistance = reduce(Infinity)<Adequacy>(min)(_ => _.distanceToClosestProvider)

export let averageTime = reduce(0)<Adequacy>(average)(_ => _.timeToClosestProvider)
export let maxTime = reduce(-Infinity)<Adequacy>(max)(_ => _.timeToClosestProvider)
export let minTime = reduce(Infinity)<Adequacy>(min)(_ => _.timeToClosestProvider)

export let population = reduce(0)<RepresentativePoint>(sum)(_ => _.population)
