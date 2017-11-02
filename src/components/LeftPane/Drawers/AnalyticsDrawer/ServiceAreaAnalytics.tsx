import { values } from 'lodash'
import * as React from 'react'
import { withStore } from '../../../../services/store'
import { averageDistance, averageTime, maxDistance, maxTime, minDistance, minTime } from '../../../../utils/analytics'
import { StatsBox } from '../../../StatsBox/StatsBox'
import { AdequacyDoughnut } from './AdequacyDoughnut'
import './ServiceAreaAnalytics.css'

export let ServiceAreaAnalytics = withStore(
  'adequacies',
  'selectedServiceArea',
  'serviceAreas'
)(({ store }) => {

  let adequacies = values(store.get('adequacies'))
  let selectedServiceArea = store.get('selectedServiceArea')!
  let serviceAreas = store.get('serviceAreas')

  return <div className='ServiceAreaAnalytics'>
    <AdequacyDoughnut serviceAreas={[store.get('selectedServiceArea')!]} />
    <StatsBox withBorders>
      <tr>
        <th />
        <th>Avg</th>
        <th>Min</th>
        <th>Max</th>
      </tr>
      <tr>
        <th>Distance (mi)</th>
        <td>{averageDistance([selectedServiceArea])(adequacies).toLocaleString()}</td>
        <td>{minDistance([selectedServiceArea])(adequacies).toLocaleString()}</td>
        <td>{maxDistance([selectedServiceArea])(adequacies).toLocaleString()}</td>
      </tr>
      <tr>
        <th>Time (min)</th>
        <td>{averageTime([selectedServiceArea])(adequacies).toLocaleString()}</td>
        <td>{minTime([selectedServiceArea])(adequacies).toLocaleString()}</td>
        <td>{maxTime([selectedServiceArea])(adequacies).toLocaleString()}</td>
      </tr>
    </StatsBox>
  </div>
})
