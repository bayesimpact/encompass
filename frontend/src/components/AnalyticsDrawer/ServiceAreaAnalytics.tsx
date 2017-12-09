import * as React from 'react'
import { withStore } from '../../services/store'
import { averageDistance, maxDistance, minDistance } from '../../utils/analytics'
import { adequaciesFromServiceArea } from '../../utils/data'
import { formatNumber } from '../../utils/formatters'
import { AdequacyDoughnut } from '../AdequacyDoughnut/AdequacyDoughnut'
import { StatsBox } from '../StatsBox/StatsBox'
import './ServiceAreaAnalytics.css'

export let ServiceAreaAnalytics = withStore(
  'adequacies',
  'selectedServiceArea',
  'serviceAreas'
)(({ store }) => {

  let selectedServiceAreas = store.get('serviceAreas')
  if (store.get('selectedServiceArea')) {
    selectedServiceAreas = [store.get('selectedServiceArea')!]
  }

  let adequacies = adequaciesFromServiceArea(selectedServiceAreas, store)

  return <div className='ServiceAreaAnalytics'>
    <p className='Ellipsis Muted SmallFont'>
      Service Areas - {store.get('uploadedServiceAreasFilename')
        ? store.get('uploadedServiceAreasFilename')
        : `${formatNumber(selectedServiceAreas.length)} selected`
      }
      <br />
      Providers - {store.get('uploadedProvidersFilename')}
    </p>
    <AdequacyDoughnut serviceAreas={selectedServiceAreas} />
    <StatsBox withBorders withHorizontalLines>
      <tr>
        <th />
        <th>Avg</th>
        <th>Min</th>
        <th>Max</th>
      </tr>
      <tr>
        <th>Distance (mi)</th>
        <td>{formatNumber(averageDistance(adequacies))}</td>
        <td>{formatNumber(minDistance(adequacies))}</td>
        <td>{formatNumber(maxDistance(adequacies))}</td>
      </tr>
      <tr>
        <th>Time (min)</th>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>
    </StatsBox>
  </div>
})
