import { AdequacyMode } from './datatypes'

export const ADEQUACY_COLORS: Record<AdequacyMode, string> = {
  ADEQUATE_15: 'rgba(63, 81, 181, 1)',
  ADEQUATE_30: 'rgba(63, 81, 181, .6)',
  ADEQUATE_60: 'rgba(63, 81, 181, .3)',
  INADEQUATE: '#DE5B5C',
  OUT_OF_SCOPE: 'transparent'
}
