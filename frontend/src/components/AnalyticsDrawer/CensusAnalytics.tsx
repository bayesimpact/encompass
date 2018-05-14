import { isEmpty } from 'lodash'
import CircularProgress from 'material-ui/CircularProgress'
import * as React from 'react'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceArea } from '../../utils/data'
import { formatNumber } from '../../utils/formatters'
import { CensusAdequacyCharts } from '../CensusAdequacyCharts/CensusAdequacyCharts'
import { CensusAdequacyTable } from '../CensusAdequacyTable/CensusAdequacyTable'
import { DownloadAnalysisLink } from '../DownloadAnalysisLink/DownloadAnalysisLink'
import { StatsBox } from '../StatsBox/StatsBox'
import './CensusAnalytics.css'

export let CensusAnalytics = withStore(({ store }) => {

  let selectedServiceAreas = store.get('selectedServiceAreas') ? store.get('selectedServiceAreas')! : store.get('serviceAreas')
  let selectedCensusCategory = store.get('selectedCensusCategory')
  let populationByAdequacy = summaryStatisticsByServiceArea(selectedServiceAreas, store.get('adequacies'), store.get('representativePoints'))
  let totalPopulation = populationByAdequacy.reduce(function (a, b) { return a + b }, 0)
  let totalProviders = store.get('providers').length

  if (isEmpty(store.get('adequacies'))) {
    return <div className='CircularProgress Flex -Center'>
      <CircularProgress
        size={150}
        thickness={8}
        color={ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0]}
      />
    </div>
  }
  return <div className='CensusAnalytics'>
    <StatsBox className='HighLevelStats' withBorders withFixedColumns withSingleRow>
      <tr>
        <th>Total Population</th>
        <td className='RightAlignedCell'>{formatNumber(totalPopulation)}</td>
        <th>Providers</th>
        <td className='RightAlignedCell'>{formatNumber(totalProviders)}</td>
      </tr>
    </StatsBox>
    <div className='TableHelpText'>Click on a row to filter data on the map.</div>
    <CensusAdequacyTable serviceAreas={selectedServiceAreas} censusCategory={selectedCensusCategory} />
    < div className='DownloadLink'>
      <DownloadAnalysisLink />
    </div>
    <CensusAdequacyCharts serviceAreas={selectedServiceAreas} censusCategory={selectedCensusCategory} />
  </div>
})
