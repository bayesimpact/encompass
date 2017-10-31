export type Provider = {
  address: string
  id: number
  languages: string[]
  lat: number
  lng: number
  npi: number
  specialty: string
}

export type RepresentativePoint = {
  id: number
  lat: number
  lng: number
  population: number
  service_area_id: number
}
