import * as React from 'react'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import './MapLegend.css'

export let MapLegend = withStore('method', 'selectedCensusGroup')(({ store }) =>
  <ul className='MapLegend'>
    Population by Access
    <li><i>{store.get('selectedCensusGroup')}</i></li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0] }}
    />{getLegend(store.get('method'), AdequacyMode.ADEQUATE_0)}</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_1] }}
    />{getLegend(store.get('method'), AdequacyMode.ADEQUATE_1)}</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_2] }}
    />{getLegend(store.get('method'), AdequacyMode.ADEQUATE_2)}</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.INADEQUATE] }}
    />{getLegend(store.get('method'), AdequacyMode.INADEQUATE)}</li>
  </ul>
)

export function getLegend(method: Method, standard: AdequacyMode) {
  switch (method) {
    case 'straight_line':
      switch (standard) {
        case AdequacyMode.ADEQUATE_0: return '< 5 km'
        case AdequacyMode.ADEQUATE_1: return '< 10 km'
        case AdequacyMode.ADEQUATE_2: return '< 20 km'
        case AdequacyMode.INADEQUATE: return '> 20 km'
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
