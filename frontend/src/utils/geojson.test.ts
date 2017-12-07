import { boundingBox } from './geojson'

let representativePoints = [
  { county: 'Sonoma', id: 1, lat: 123.1, lng: 32.109, population: 100, serviceAreaId: 'Sonoma-90000', zip: '90000' },
  { county: 'Sonoma', id: 2, lat: 122.01, lng: 32.3123, population: 101, serviceAreaId: 'Sonoma-90001', zip: '90001' },
  { county: 'Sonoma', id: 3, lat: 122.45, lng: 31.4, population: 200, serviceAreaId: 'Sonoma-90002', zip: '90002' },
  { county: 'Sonoma', id: 4, lat: 121.6, lng: 33.86, population: 102912, serviceAreaId: 'Sonoma-90003', zip: '90003' },
  { county: 'Sonoma', id: 5, lat: 124.8, lng: 30.9889, population: 11, serviceAreaId: 'Sonoma-90004', zip: '90004' },
  { county: 'Sonoma', id: 6, lat: 123.460, lng: 34.91, population: 11, serviceAreaId: 'Sonoma-90005', zip: '90005' },
  { county: 'Sonoma', id: 7, lat: 128.8712, lng: 32.11, population: 11, serviceAreaId: 'Sonoma-90006', zip: '90006' },
  { county: 'Sonoma', id: 8, lat: 122.12, lng: 32.009, population: 11, serviceAreaId: 'Sonoma-90007', zip: '90007' },
  { county: 'Sonoma', id: 9, lat: 125.37, lng: 33.423, population: 11, serviceAreaId: 'Sonoma-90008', zip: '90008' }
]

test('boundingBox', () => {
  expect(boundingBox([])).toBe(null)
  expect(boundingBox(representativePoints)).toEqual({
    sw: { lat: 121.6, lng: 30.9889 },
    ne: { lat: 128.8712, lng: 34.91 }
  })
})
