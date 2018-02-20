import * as React from 'react'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceArea } from '../../utils/data'
import { formatNumber } from '../../utils/formatters'
import { AdequacyCensusCharts } from '../AdequacyCensusCharts/AdequacyCensusCharts'
import { StatsBox } from '../StatsBox/StatsBox'
import './CensusAnalytics.css'

export let CensusAnalytics = withStore(
  'adequacies',
  'selectedServiceAreas',
  'serviceAreas'
)(({ store }) => {

  let selectedServiceAreas = store.get('selectedServiceAreas') ? store.get('selectedServiceAreas')! : store.get('serviceAreas')
  let selectedCensusCategory = store.get('selectedCensusCategory')
  let populationByAdequacy = summaryStatisticsByServiceArea(selectedServiceAreas, store)
  let totalPopulation = populationByAdequacy.reduce(function (a, b) { return a + b }, 0)
  let totalProviders = store.get('providers').length

  return <div className='CensusAnalytics'>
    <StatsBox className='HighLevelStats -withFixedColumnns' withBorders>
      <tr>
        <th>Total Population</th>
        <th>Providers</th>
        <th>Ratio</th>
      </tr>
      <tr>
        <td>{formatNumber(totalPopulation)}</td>
        <td>{formatNumber(totalProviders)}</td>
        <td>{formatNumber(totalProviders / totalPopulation)}</td>
      </tr>
    </StatsBox>
    <AdequacyCensusCharts serviceAreas={selectedServiceAreas} censusCategory={selectedCensusCategory} />
  </div>
})
