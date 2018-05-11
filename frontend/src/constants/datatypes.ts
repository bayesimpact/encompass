import { EventData } from 'mapbox-gl'
import { State } from './states'

export type ModalName = 'About' | 'Methodology'

export type Adequacies = {
  [representativePointId: string]: Adequacy
}

export type Adequacy = {
  adequacyMode: AdequacyMode
  /** Representative point Id */
  id: number
  toClosestProvider: number
  closestProvider: GeocodedProvider
}

export enum AdequacyMode {
  ADEQUATE_0 = 'ADEQUATE_0',
  ADEQUATE_1 = 'ADEQUATE_1',
  ADEQUATE_2 = 'ADEQUATE_2',
  INADEQUATE = 'INADEQUATE',
  OUT_OF_SCOPE = 'OUT_OF_SCOPE'
}

export type CensusGroup = {
  censusCategory: string
  censusGroup: string
}

export type Config = {
  enable_geocoding: boolean
  is_census_data_available: boolean
  is_walking_available: boolean
  limit_upload_file_size: boolean
  show_about_dialog_on_start: boolean
  absurdly_large_placeholder_time: Number
  title_suffix: string
  api: {
    [key: string]: string | boolean
  }
  analysis: {
    [key: string]: boolean
  }
  cache: {
    [key: string]: string | boolean
  }
  dataset: {
    [key: string]: boolean
  }
  staticAssets: {
    appIsStatic: boolean,
    rootUrl: string
    csv: {
      useStaticCsvs: boolean,
      path: string
    }
    representativePoints: {
      path: string
    }
    adequacies: {
      path: string
    }
    demographics: {
      path: string
    }
  }
}

export type CountyType = 'All' | 'Rural' | 'Urban'

export type Dataset = {
  dataSources: string,
  state: State,
  description: string
  name: string
  subtitle: string
  hint?: string
  providers: GeocodedProvider[],
  serviceAreaIds: string[]
  usaWide?: boolean
  defaultDemographics?: CensusGroup
}

export type Format = 'Percentage' | 'Number'

/**
 * TODO: Contribute this typing to react-mapbox-gl
 */
export type GeoJSONEventData = EventData & {
  features: GeoJSON.Feature<GeoJSON.GeometryObject>[]
}

export type Method = 'driving_time' | 'straight_line' | 'walking_time'

export type PopulationByAdequacy = number[]

export type Provider = {
  address: string
  [K: string]: number | string | string[] | undefined
}

export type GeocodedProvider = Provider & {
  lat: number
  lng: number
}

/**
 * For now, these are possible states for the left drawer.
 *
 * In the future, they will map to URL routes.
 */
export type Route = '/' | '/analytics' | '/datasets' | '/add-data'

export type RepresentativePoint = {
  county: string
  id: number
  lat: number
  lng: number
  population: number
  demographics?: any
  serviceAreaId: string
  zip: string
  // [K: string]: number | string | string[]
}

export type FilterMethod = 'All' | 'County Name' | 'County Type'
