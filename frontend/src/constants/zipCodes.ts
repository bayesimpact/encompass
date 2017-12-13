import { chain, keys, mapValues } from 'lodash'
import { serializeServiceArea } from '../utils/serializers'
import { State } from './states'
import { ZIPS_BY_COUNTY_BY_STATE } from './zipsByCountyByStateCode'

export const COUNTIES_BY_STATE: Record<State, string[]> = mapValues(ZIPS_BY_COUNTY_BY_STATE, keys)

export const COUNTIES_BY_ZIP = chain(ZIPS_BY_COUNTY_BY_STATE)
  .map(_ => chain(_).map((zs, c) => zs.map(z => [z, c])).flatten().value())
  .flatten()
  .fromPairs()
  .value()

/**
 * TODO: Assign integer IDs to each county-zip tuple instead
 * of using these ad-hoc string keys
 */
export const SERVICE_AREAS_BY_COUNTY_BY_STATE: Record<State, { [county: string]: string[] }> =
  mapValues(
    ZIPS_BY_COUNTY_BY_STATE,
    (cs, s: State) => mapValues(
      cs,
      (zs, c) => zs.map(z => serializeServiceArea(s, c, z)))
  )
