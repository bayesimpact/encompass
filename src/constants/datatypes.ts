export type Adequacies = {
  [representativePointId: string]: Adequacy
}

export enum AdequacyMode {
  ADEQUATE = 'ADEQUATE',
  INADEQUATE = 'INADEQUATE',
  OUT_OF_SCOPE = 'OUT_OF_SCOPE'
}

export type Adequacy = {
  adequacy: AdequacyMode
  /** Representative point Id */
  id: number
  distanceToClosestProvider: number
  timeToClosestProvider: number
  closestProviderByDistance: number
  closestProviderByTime: number
}

export type Measure = 15 | 20 | 30

export type Provider = {
  address: string
  id: number
  languages: string[]
  lat: number
  lng: number
  npi: number
  specialty: string | null
}

export type Standard = 'time_distance' | 'time' | 'distance'

export type RepresentativePoint = {
  county: string
  id: number
  lat: number
  lng: number
  population: number
  serviceAreaId: string
  zip: string
}
