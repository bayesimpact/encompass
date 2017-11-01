import { connect, createStore, Store } from 'babydux'
import { Adequacies, Measure, Provider, RepresentativePoint, Standard } from '../constants/datatypes'
import { WriteProvidersRequest } from './api'
import { withDemo } from './demo'
import { withEffects } from './effects'

export type Actions = {

  adequacies: Adequacies

  /**
   * Counties selected by the user in the Service Area Drawer.
   *
   * `COUNTIES` (in zipCodes.ts) enumerates all available Counties.
   */
  counties: string[]

  distribution: 0.5 | 2.5 | 5
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
}

export let store = withDemo(withEffects(createStore<Actions>({
  adequacies: {},
  counties: [],
  distribution: 0.5,
  measure: 15,
  providers: [],
  representativePoints: [],
  selectedServiceArea: null,
  serviceAreas: [],
  standard: 'time_distance',
  uploadedProviders: [],
  uploadedProvidersFilename: null,
  uploadedServiceAreasFilename: null
}, true)))

export let withStore = connect(store)

export type StoreProps = {
  store: Store<Actions>
}
