export type Adequacies = {
  [representativePointId: string]: boolean
}

export type Measure = 15 | 20 | 30

export type Provider = {
  address: string
  id: number
  languages: string[]
  lat: number
  lng: number
  npi: number
  specialty: string
}

export type Standard = 'time_distance' | 'time' | 'distance'

export type RepresentativePoint = {
  county: string
  id: number
  lat: number
  lng: number
  population: number
  service_area_id: string
  zip: string
}
