import { chain } from 'lodash'
import { Adequacy, AdequacyMode, GeocodedProvider } from '../constants/datatypes'
import { averageMeasure, maxMeasure, minMeasure, totalPopulation } from './analytics'

let provider: GeocodedProvider = {
  address: '1234 Main St. San Francisco CA 94111',
  languages: ['english', 'japanese'],
  lat: 123.456,
  lng: -123.456,
  npi: '123456789',
  specialty: 'internal medicine'
}

let adequacies1: Lazy<Adequacy[]> = chain([
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 21, closestProvider: provider },
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 31, closestProvider: provider },
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 41, closestProvider: provider },
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 51, closestProvider: provider }
])

let adequacies2: Lazy<Adequacy[]> = chain([
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 0, closestProvider: provider },
  { adequacyMode: AdequacyMode.INADEQUATE, id: 0, toClosestProvider: 0, closestProvider: provider }
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

test('averageMeasure', () => {
  expect(averageMeasure(adequacies1)).toBe(36)
  expect(averageMeasure(adequacies2)).toBe(0)
})

test('maxMeasure', () => {
  expect(maxMeasure(adequacies1)).toBe(51)
  expect(maxMeasure(adequacies2)).toBe(0)
})

test('minMeasure', () => {
  expect(minMeasure(adequacies1)).toBe(21)
  expect(minMeasure(adequacies2)).toBe(0)
})

test('totalPopulation', () => {
  expect(totalPopulation(representativePoints1)).toBe(103324)
  expect(totalPopulation(representativePoints2)).toBe(0)
})
