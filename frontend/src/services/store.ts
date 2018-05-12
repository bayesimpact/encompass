import { FeatureCollection, GeometryObject } from 'geojson'
import { Map } from 'mapbox-gl'
import { isMobile } from 'react-device-detect'
import { connect, createStore, Store as UnduxStore } from 'undux'
import { CONFIG } from '../config/config'
import { CENSUS_MAPPING, CENSUS_MAPPING_ERROR } from '../constants/census'
import { Adequacies, CountyType, Dataset, FilterMethod, Format, GeocodedProvider, GeoJSONEventData, Method, ModalName, Provider, RepresentativePoint, Route } from '../constants/datatypes'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants/map'
import { State as StateShortName } from '../constants/states'
import { withEffects } from './effects'

export type State = {

  adequacies: Adequacies

  allowDrivingTime: boolean

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

  /**
   * Alert, exposed to user as a modal.
   */
  alert: string | null

  /**
   * Control which modal is displayed
   */
  modal: ModalName | null

  /**
   * Control selection of counties for add dataset drawer.
   */
  useCustomCountyUpload: boolean | null

  mapCenter: {
    lat: number
    lng: number
  }

  map: Map | null

  mapCursor: string

  mapZoom: number[] | null

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
   * each service area, we sample the real population (from satellite & census data).
   */
  representativePoints: RepresentativePoint[]

  route: Route

  selectedCensusCategory: string

  selectedCensusGroup: string

  selectedCounties: string[] | null

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
  selectedState: StateShortName

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

  /**
   * Keep the point FeatureCollections in the store so we don't have to keep rebuilding it.
   */
  pointFeatureCollections: FeatureCollection<GeometryObject>[] | null
}

/**
 * Note: Do not export this. Use `withStore` or effects (see effects.ts) instead.
 */
let initialState: State = {
  adequacies: {},
  allowDrivingTime: true,
  counties: [],
  error: null,
  success: null,
  alert: isMobile ? 'Encompass is not optimized for mobile devices yet. Please visit using a desktop browser for better performance and usability.' : null,
  modal: CONFIG.show_about_dialog_on_start ? 'About' : null,
  useCustomCountyUpload: null,
  map: null,
  mapCenter: DEFAULT_MAP_CENTER,
  mapCursor: '',
  mapZoom: DEFAULT_MAP_ZOOM,
  method: 'driving_time',
  providerIndex: 0,
  providers: [],
  representativePoints: [],
  route: '/datasets',
  selectedCensusCategory: Object.keys(CENSUS_MAPPING)[0] || CENSUS_MAPPING_ERROR,
  selectedCensusGroup: 'Total Population',
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
  uploadedServiceAreasFilename: null,
  pointFeatureCollections: null
}

let store = withEffects(createStore(initialState))

export let withStore = connect(store)

export type Store = UnduxStore<State>
