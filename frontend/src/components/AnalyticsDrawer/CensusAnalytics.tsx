import * as React from 'react'
import { withStore } from '../../services/store'
import { AdequacyCensusCharts } from '../AdequacyCensusCharts/AdequacyCensusCharts'
import './CensusAnalytics.css'

export let CensusAnalytics = withStore(
  'adequacies',
  'selectedServiceAreas',
  'serviceAreas'
)(({ store }) => {

  let selectedServiceAreas = store.get('serviceAreas')
  if (store.get('selectedServiceAreas')) {
    selectedServiceAreas = store.get('selectedServiceAreas')!
  }

  let selectedCensusCategory = store.get('selectedCensusCategory')

  return <div className='CensusAnalytics'>
    <AdequacyCensusCharts serviceAreas={selectedServiceAreas} censusCategory={selectedCensusCategory} />
  </div>
})
