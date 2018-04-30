import { PostAdequaciesResponse } from '../constants/api/adequacies-response'
import { AdequacyMode, Method } from '../constants/datatypes'

let ONE_MILE_IN_METERS = 1609.344
let ONE_METER_IN_MILES = 1.0 / ONE_MILE_IN_METERS

export function getAdequacyMode(
  adequacy: PostAdequaciesResponse[0],
  method: Method,
  serviceAreaId: string,
  selectedServiceAreas: string[] | null
): AdequacyMode {

  if (selectedServiceAreas && !selectedServiceAreas.includes(serviceAreaId)) {
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (method === 'straight_line') {
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 10) {
      return AdequacyMode.ADEQUATE_0
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 20) {
      return AdequacyMode.ADEQUATE_1
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES <= 30) {
      return AdequacyMode.ADEQUATE_2
    }
    if (adequacy.to_closest_provider * ONE_METER_IN_MILES > 30) {
      return AdequacyMode.INADEQUATE
    }
    return AdequacyMode.OUT_OF_SCOPE
  }

  if (method === 'driving_time' || method === 'walking_time') {
    if (adequacy.to_closest_provider <= 30) {
      return AdequacyMode.ADEQUATE_0
    }
    if (adequacy.to_closest_provider <= 45) {
      return AdequacyMode.ADEQUATE_1
    }
    if (adequacy.to_closest_provider <= 60) {
      return AdequacyMode.ADEQUATE_2
    }
    if (adequacy.to_closest_provider > 60) {
      return AdequacyMode.INADEQUATE
    }
  }
  return AdequacyMode.OUT_OF_SCOPE
}

export function getLegend(method: Method, standard: AdequacyMode) {
  switch (method) {
    case 'straight_line':
      switch (standard) {
        case AdequacyMode.ADEQUATE_0: return '0-10 mi'
        case AdequacyMode.ADEQUATE_1: return '10-20 mi'
        case AdequacyMode.ADEQUATE_2: return '20-30 mi'
        case AdequacyMode.INADEQUATE: return '30+ mi'
      }
      break
    case 'driving_time':
    case 'walking_time':
      switch (standard) {
        case AdequacyMode.ADEQUATE_0: return '0-30 min'
        case AdequacyMode.ADEQUATE_1: return '30-45 min'
        case AdequacyMode.ADEQUATE_2: return '45-60 min'
        case AdequacyMode.INADEQUATE: return '60+ min'
      }
      break
  }
  return ''
}
