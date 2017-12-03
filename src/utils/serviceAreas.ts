import { chain, memoize } from 'lodash'
import { STATE_TO_COUNTIES_TO_ZIPS, STATE_TO_STATE_ID } from '../constants/zipCodes'
import { serializeServiceArea } from '../utils/serializers'

/**
 * Get list of counties from state.
 * @param state
 */

export function getCountiesFromState(state: string) {
  return Object.keys(STATE_TO_COUNTIES_TO_ZIPS[state]).sort()
}

export function getZipsFromState(state: string) {
  return chain(getCountiesFromState(state)).values().flatten().uniq().sort().value()
}

/**
 * TODO: Assign integer IDs to each county-zip tuple instead
 * of using these ad-hoc string keys
 */
export function getServiceAreasFromState(state: string) {
  return chain(getCountiesFromState(state))
    .map(_ => STATE_TO_COUNTIES_TO_ZIPS[state][_].map(z => serializeServiceArea(STATE_TO_STATE_ID[state], _, z)))
    .flatten()
    .value()
}

export function serviceAreasFromStateAndCounties(state: string, counties: string[]) {
  return chain(counties)
    .map(_ => STATE_TO_COUNTIES_TO_ZIPS[state][_].map(z => serializeServiceArea(STATE_TO_STATE_ID[state], _, z)))
    .flatten()
    .value()
}

export let countiesFromZip = memoize((state: string, zip: string) => {
  return chain(STATE_TO_COUNTIES_TO_ZIPS[state])
    .toPairs()
    .filter(([_, v]) => v.includes(zip))
    .map(([k]) => k)
    .value()
})

export let zipsFromStateAndCounty = (state: string, county: string) =>
  STATE_TO_COUNTIES_TO_ZIPS[state][county]
