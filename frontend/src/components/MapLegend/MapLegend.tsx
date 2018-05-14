import * as React from 'react'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { getLegend } from '../../utils/adequacy'
import './MapLegend.css'

export let MapLegend = withStore(({ store }) =>
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
