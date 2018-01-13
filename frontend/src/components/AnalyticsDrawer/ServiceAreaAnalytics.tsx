import * as React from 'react'
import { withStore } from '../../services/store'
import { formatNumber } from '../../utils/formatters'
import { AdequacyDoughnut } from '../AdequacyDoughnut/AdequacyDoughnut'
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

  return <div className='ServiceAreaAnalytics'>
    <p className='Ellipsis Muted SmallFont'>
      Service Areas - {formatNumber(selectedServiceAreas.length)} selected
    </p>
    <AdequacyDoughnut serviceAreas={selectedServiceAreas} />
  </div>
})
