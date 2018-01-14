import * as React from 'react'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import './MapLegend.css'

export let MapLegend = withStore('method')(({ store }) =>
  <ul className='MapLegend'>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_15] }}
    />Adequate ({getCopy(store.get('method'), AdequacyMode.ADEQUATE_15)})</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_30] }}
    />Adequate ({getCopy(store.get('method'), AdequacyMode.ADEQUATE_30)})</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.ADEQUATE_60] }}
    />Adequate ({getCopy(store.get('method'), AdequacyMode.ADEQUATE_60)})</li>
    <li><div
      className='Splotch'
      style={{ backgroundColor: ADEQUACY_COLORS[AdequacyMode.INADEQUATE] }}
    />Inadequate</li>
  </ul>
)

function getCopy(method: Method, standard: AdequacyMode) {
  switch (method) {
    case 'driving_distance':
    case 'haversine_distance':
      switch (standard) {
        case AdequacyMode.ADEQUATE_15: return '15 miles'
        case AdequacyMode.ADEQUATE_30: return '30 miles'
        case AdequacyMode.ADEQUATE_60: return '60 miles'
      }
      break
    case 'driving_time':
      switch (standard) {
        case AdequacyMode.ADEQUATE_15: return '30 min'
        case AdequacyMode.ADEQUATE_30: return '45 min'
        case AdequacyMode.ADEQUATE_60: return '60 min'
      }
      break
  }
}
