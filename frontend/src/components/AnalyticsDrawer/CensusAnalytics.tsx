import * as React from 'react'
import { withStore } from '../../services/store'
import { AdequacyCensusCharts } from '../AdequacyCensusCharts/AdequacyCensusCharts'
import { AdequacyDoughnut } from '../AdequacyDoughnut/AdequacyDoughnut'
import './CensusAnalytics.css'

export let CensusAnalytics = withStore(
  'adequacies',
  'selectedServiceAreas',
  'serviceAreas'
)(({ store }) => {

  let selectedServiceAreas = store.get('selectedServiceAreas') ? store.get('selectedServiceAreas')! : store.get('serviceAreas')
  let selectedCensusCategory = store.get('selectedCensusCategory')

  return selectedCensusCategory !== 'all' ?
    <div className='CensusAnalytics'>
      <AdequacyCensusCharts serviceAreas={selectedServiceAreas} censusCategory={selectedCensusCategory} />
    </div> :
    <div className='CensusAnalytics'>
      <AdequacyDoughnut serviceAreas={selectedServiceAreas} />
    </div>
})
