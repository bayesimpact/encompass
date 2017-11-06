import { filter, keyBy } from 'lodash'
import * as React from 'react'
import { withStore } from '../../../../services/store'
import { totalPopulation } from '../../../../utils/analytics'
import { representativePointsFromServiceAreas } from '../../../../utils/data'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDoughnut } from './AdequacyDoughnut'
import './TotalAnalytics.css'

export let TotalAnalytics = withStore()(({ store }) => {

  let serviceAreas = store.get('serviceAreas')
  let representativePoints = representativePointsFromServiceAreas(serviceAreas, store)

  return <div className='TotalAnalytics'>
    <StatsBox className='HighLevelStats' withBorders>
      <tr>
        <th>Service Areas</th>
        <th>Population</th>
        <th>Providers</th>
      </tr>
      <tr>
        <td>{serviceAreas.length}</td>
        <td>{totalPopulation(representativePoints).toLocaleString()}</td>
        <td>{store.get('providers').length.toLocaleString()}</td>
      </tr>
    </StatsBox>
    <AdequacyDoughnut serviceAreas={serviceAreas} />
  </div>
})
