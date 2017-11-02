import { chain, keyBy } from 'lodash'
import { Adequacies, Adequacy, Provider, RepresentativePoint } from '../constants/datatypes'

let reduce = (initial: number) =>
  <T extends { serviceAreaId: string }>(
    f: (acc: number, current: number, index: number, array: number[]) => number
  ) =>
    <K extends keyof T>(property: K) =>
      (serviceAreas: string[]) =>
        (data: T[]) => {
          let hash = keyBy(serviceAreas)
          return chain(data)
            .filter(_ => _.serviceAreaId in hash)
            .map(property)
            .reduce(f, initial)
            .round()
            .value()
        }

let average = (a: number, b: number, index: number, array: number[]) => a + b / array.length
let max = (a: number, b: number) => Math.max(a, b)
let min = (a: number, b: number) => Math.min(a, b)
let sum = (a: number, b: number) => a + b

export let averageDistance = reduce(0)<Adequacy>(average)('distanceToClosestProvider')
export let maxDistance = reduce(-Infinity)<Adequacy>(max)('distanceToClosestProvider')
export let minDistance = reduce(Infinity)<Adequacy>(min)('distanceToClosestProvider')

export let averageTime = reduce(0)<Adequacy>(average)('timeToClosestProvider')
export let maxTime = reduce(-Infinity)<Adequacy>(max)('timeToClosestProvider')
export let minTime = reduce(Infinity)<Adequacy>(min)('timeToClosestProvider')

export let population = reduce(0)<RepresentativePoint>(sum)('population')
