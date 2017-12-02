import { connect, createStore, Store as BabyduxStore } from 'babydux'
import { Adequacies, Measure, Provider, RepresentativePoint, Standard } from '../constants/datatypes'
import { WriteProvidersRequest } from './api'
import { withEffects } from './effects'

export type Actions = {

  adequacies: Adequacies

  /**
   * State selected by the user in the Service Area Drawer.
   *
   * `STATES` (in zipCodes.ts) enumerates all available States.
   */
  state: string

  /**
   * Counties selected by the user in the Service Area Drawer.
   *
   * `COUNTIES` (in zipCodes.ts) enumerates all available Counties.
   */
  counties: string[]

  distribution: 0.5 | 2.5 | 5.0

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
   * fewer RPs we generate per service area.
   */
  representativePoints: RepresentativePoint[]

  /**
   * Service areas that the user selected on the map.
   *
   * We support just one selection for now, but will likely support
   * multi-select in the future.
   */
  selectedServiceArea: string | null

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
   * We auto-center and auto-zoom the map after the user uploads service areas,
   * but we don't want to do it otherwise. We use this state to keep track of
   * whether or not the map should auto-adjust after it renders.
   */
  shouldAutoAdjustMap: boolean

  standard: Standard

  /**
   * Parsed from the uploaded providers CSV
   */
  uploadedProviders: WriteProvidersRequest[]

  /**
   * Filename of the CSV the user uploaded to compute `providers`.
   */
  uploadedProvidersFilename: string | null

  /**
   * Filename of the CSV the user uploaded to compute `serviceAreas`.
   */
  uploadedServiceAreasFilename: string | null

  /**
   * Selected povider for popup.
   * TODO - Do not use any.
   */
  providerClicked: any | null

  /**
   * Selected representativePoint for popup.
   * TODO - Do not use any.
   */
  representativePointClicked: any | null
}

/**
 * Note: Do not export this. Use `withStore` or effects (see effects.ts) instead.
 */
let store = withEffects(createStore<Actions>({
  adequacies: {},
  state: 'texas',
  counties: [],
  distribution: 0.5,
  error: null,
  success: null,
  mapCenter: {
    lat: 37.765134,
    lng: -122.444687
  },
  mapCursor: '',
  mapZoom: 12,
  measure: 15,
  providers: [],
  representativePoints: [],
  selectedServiceArea: null,
  serviceAreas: [],
  shouldAutoAdjustMap: true,
  standard: 'distance',
  uploadedProviders: [],
  uploadedProvidersFilename: null,
  uploadedServiceAreasFilename: null,
  providerClicked: null,
  representativePointClicked: null
}))

export let withStore = connect(store)

export type Store = BabyduxStore<Actions>

export type StoreProps = {
  store: Store
}
