import { chain } from 'lodash'
import { averageDistance, averageTime, maxDistance, maxTime, minDistance, minTime, totalPopulation } from './analytics'

let adequacies1 = chain([
  { isAdequate: false, id: 0, distanceToClosestProvider: 10, timeToClosestProvider: 21, closestProviderByDistance: 63, closestProviderByTime: 63 },
  { isAdequate: false, id: 0, distanceToClosestProvider: 20, timeToClosestProvider: 31, closestProviderByDistance: 63, closestProviderByTime: 63 },
  { isAdequate: false, id: 0, distanceToClosestProvider: 30, timeToClosestProvider: 41, closestProviderByDistance: 63, closestProviderByTime: 63 },
  { isAdequate: false, id: 0, distanceToClosestProvider: 40, timeToClosestProvider: 51, closestProviderByDistance: 63, closestProviderByTime: 63 }
])

let adequacies2 = chain([
  { isAdequate: false, id: 0, distanceToClosestProvider: 0, timeToClosestProvider: 0, closestProviderByDistance: 63, closestProviderByTime: 63 },
  { isAdequate: false, id: 0, distanceToClosestProvider: 0, timeToClosestProvider: 0, closestProviderByDistance: 63, closestProviderByTime: 63 }
])

let representativePoints1 = chain([
  { county: 'Sonoma', id: 1, lat: 123.456, lng: 32.109, population: 100, serviceAreaId: 'Sonoma-90000', zip: '90000' },
  { county: 'Sonoma', id: 2, lat: 123.457, lng: 32.109, population: 101, serviceAreaId: 'Sonoma-90000', zip: '90001' },
  { county: 'Sonoma', id: 3, lat: 123.458, lng: 32.109, population: 200, serviceAreaId: 'Sonoma-90000', zip: '90002' },
  { county: 'Sonoma', id: 4, lat: 123.459, lng: 32.109, population: 102912, serviceAreaId: 'Sonoma-90000', zip: '90003' },
  { county: 'Sonoma', id: 5, lat: 123.460, lng: 32.109, population: 11, serviceAreaId: 'Sonoma-90000', zip: '90004' }
])

let representativePoints2 = chain([
  { county: 'Napa', id: 6, lat: 123.456, lng: 32.109, population: 0, serviceAreaId: 'Napa-90010', zip: '90010' },
  { county: 'Napa', id: 7, lat: 123.457, lng: 32.109, population: 0, serviceAreaId: 'Napa-90011', zip: '90011' },
  { county: 'Napa', id: 8, lat: 123.458, lng: 32.109, population: 0, serviceAreaId: 'Napa-90012', zip: '90012' }
])

test('averageDistance', () => {
  expect(averageDistance(adequacies1)).toBe(25)
  expect(averageDistance(adequacies2)).toBe(0)
})

test('maxDistance', () => {
  expect(maxDistance(adequacies1)).toBe(40)
  expect(maxDistance(adequacies2)).toBe(0)
})

test('minDistance', () => {
  expect(minDistance(adequacies1)).toBe(10)
  expect(minDistance(adequacies2)).toBe(0)
})

test('averageTime', () => {
  expect(averageTime(adequacies1)).toBe(36)
  expect(averageTime(adequacies2)).toBe(0)
})

test('maxTime', () => {
  expect(maxTime(adequacies1)).toBe(51)
  expect(maxTime(adequacies2)).toBe(0)
})

test('minTime', () => {
  expect(minTime(adequacies1)).toBe(21)
  expect(minTime(adequacies2)).toBe(0)
})

test('totalPopulation', () => {
  expect(totalPopulation(representativePoints1)).toBe(103324)
  expect(totalPopulation(representativePoints2)).toBe(0)
})
