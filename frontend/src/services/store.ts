import { Map } from 'mapbox-gl'
import { connect, createStore, Store as BabyduxStore } from 'undux'
import { CENSUS_MAPPING, CENSUS_MAPPING_ERROR } from '../constants/census'
import { Adequacies, CountyType, Dataset, FilterMethod, Format, GeocodedProvider, GeoJSONEventData, Method, Provider, RepresentativePoint, Route } from '../constants/datatypes'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants/map'
import { State } from '../constants/states'
import { withEffects } from './effects'

type Actions = {

  adequacies: Adequacies

  /**
   * Counties selected by the user in the Service Area Drawer.
   *
   * `COUNTIES` (in zipCodes.ts) enumerates all available Counties.
   */
  counties: string[]

  /**
   * Error, exposed to user via Snackbar.
   */
  error: string | null

  /**
   * Success, exposed to user via Snackbar.
   */
  success: string | null

  mapCenter: {
    lat: number
    lng: number
  }

  map: Map | null

  mapCursor: string

  mapZoom: number

  method: Method

  /**
   * Index keeping track of provider to display for multi-provider popups.
   */
  providerIndex: number

  /**
   * Geocoded providers, augmented with metadata from the uploaded providers CSV
   */
  providers: GeocodedProvider[]

  /**
   * Representative points ("RP"), fetched and cached given a `serviceArea`. For
   * each service area, we sample the real population (from USPS & census data).
   */
  representativePoints: RepresentativePoint[]

  route: Route

  selectedCensusCategory: string

  selectedCounties: string | null

  selectedCountyType: CountyType | null

  selectedDataset: Dataset | null

  /**
   * Selector method, by County Name or County Type
   */
  selectedFilterMethod: FilterMethod

  selectedFormat: Format

  /**
   * Provider that the user selected on the map.
   */
  selectedProvider: GeoJSONEventData | null

  /**
   * Representative point that the user selected on the map.
   */
  selectedRepresentativePoint: GeoJSONEventData | null

  /**
   * Service areas that the user selected on the map.
   *
   * We support just one selection for now, but will likely support
   * multi-select in the future.
   */
  selectedServiceAreas: string[] | null

  /**
   * `shortName` of the currently selected state.
   * Users set this in the Service Area drawer.
   */
  selectedState: State

  /**
   * Strings representing county-zip tuples selected by the user in the
   * Service Area Drawer. For example, `["Yolo", "95606"]` maps to the
   * string `"Yolo / 95606"`. This representation makes it cheap to compare
   * county-zip tuples because strings are reference-equal, but arrays are
   * not. It also makes it easy to get back the original county-zip tuple.
   *
   * We refer to each county-zip tuple as a *Service Area*.
   *
   * `SERVICE_AREAS` (in zipCodes.ts) enumerates all available Service Areas.
   */
  serviceAreas: string[]

  /**
   * Parsed from the uploaded providers CSV
   */
  uploadedProviders: Provider[]

  /**
   * Filename of the CSV the user uploaded to compute `providers`.
   */
  uploadedProvidersFilename: string | null

  /**
   * Filename of the CSV the user uploaded to compute `serviceAreas`.
   */
  uploadedServiceAreasFilename: string | null
}

/**
 * Note: Do not export this. Use `withStore` or effects (see effects.ts) instead.
 */
let store = withEffects(createStore<Actions>({
  adequacies: {},
  counties: [],
  error: null,
  success: null,
  map: null,
  mapCenter: DEFAULT_MAP_CENTER,
  mapCursor: '',
  mapZoom: DEFAULT_MAP_ZOOM,
  method: 'haversine',
  providerIndex: 0,
  providers: [],
  representativePoints: [],
  route: '/datasets',
  selectedCensusCategory: Object.keys(CENSUS_MAPPING)[0] ? Object.keys(CENSUS_MAPPING)[0] : CENSUS_MAPPING_ERROR,
  selectedCounties: null,
  selectedCountyType: null,
  selectedDataset: null,
  selectedFilterMethod: 'All',
  selectedFormat: 'Percentage',
  selectedProvider: null,
  selectedRepresentativePoint: null,
  selectedServiceAreas: null,
  selectedState: 'ca',
  serviceAreas: [],
  uploadedProviders: [],
  uploadedProvidersFilename: null,
  uploadedServiceAreasFilename: null
}))

export let withStore = connect(store)

export type Store = BabyduxStore<Actions>

// for debugging
(window as any).store = store
