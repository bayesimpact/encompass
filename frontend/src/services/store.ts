import { connect, createStore, Store as BabyduxStore } from 'babydux'
import { Map } from 'mapbox-gl'
import { PostProvidersRequest } from '../constants/api/providers-request'
import { Adequacies, GeoJSONEventData, Measure, Provider, RepresentativePoint, Route, Standard } from '../constants/datatypes'
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

  distribution: 1.0

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

  measure: Measure

  /**
   * Geocoded providers, augmented with metadata from the uploaded providers CSV
   */
  providers: Provider[]

  /**
   * Representative points ("RP"), fetched and cached given a `distribution`
   * and `serviceArea`.
   *
   * For each service area, we sample the real population (from USPS & census data).
   * The larger the `distribution` parameter, the larger each RP becomes, and the
   * fewer RPs we generate per service area. The distribution defaults to 1 mile.
   */
  representativePoints: RepresentativePoint[]

  route: Route

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
  selectedServiceArea: string | null

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

  standard: Standard

  /**
   * Parsed from the uploaded providers CSV
   */
  uploadedProviders: PostProvidersRequest['providers']

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
  distribution: 1.0,
  error: null,
  success: null,
  map: null,
  mapCenter: {
    lat: 37.765134,
    lng: -122.444687
  },
  mapCursor: '',
  mapZoom: 12,
  measure: 15,
  providers: [],
  representativePoints: [],
  route: '/service-areas',
  selectedProvider: null,
  selectedRepresentativePoint: null,
  selectedServiceArea: null,
  selectedState: 'ca',
  serviceAreas: [],
  standard: 'distance',
  uploadedProviders: [],
  uploadedProvidersFilename: null,
  uploadedServiceAreasFilename: null
}))

export let withStore = connect(store)

export type Store = BabyduxStore<Actions>

export type StoreProps = {
  store: Store
}
