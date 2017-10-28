import { connect, createStore } from 'babydux'

type Store = {

  /**
   * Strings representing county-zip tuples. For example, `["Yolo", 95606]`
   * maps to the string `"Yolo-95606"`. This representation makes it cheap
   * to compare county-zip tuples because strings are reference-equal, but
   * arrays are not. It also makes it easy to get back the original
   * county-zip tuple.
   *
   * `COUNTYZIPS` (in zipCodes.ts) enumerates all available countyZips.
   */
  countyZips: string[]

  distribution: number
  measure: '15_miles' | '20_miles' | '30_miles'

  /**
   * Counties selected by the user in the Service Area Drawer.
   */
  serviceAreasCounties: string[]

  standard: 'time_distance' | 'time' | 'distance'

  /**
   * List of `[county, zip code][]` tuples uploaded by the user via CSV.
  */
  uploadedServiceAreas: [string, number][]

  /**
   * Filename of the CSV the user uploaded to compute `uploadedServiceAreas`.
   */
  uploadedServiceAreasFilename: string | null
}

export let store = createStore<Store>({
  countyZips: [],
  distribution: 0.5,
  measure: '15_miles',
  uploadedServiceAreas: [],
  uploadedServiceAreasFilename: null,
  serviceAreasCounties: [],
  standard: 'time_distance'
}, true)

export let withStore = connect(store)
