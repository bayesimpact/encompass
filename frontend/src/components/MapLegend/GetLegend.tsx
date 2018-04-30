import { AdequacyMode, Method } from '../../constants/datatypes'

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
