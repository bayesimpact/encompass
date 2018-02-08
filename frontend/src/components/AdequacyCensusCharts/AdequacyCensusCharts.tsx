import 'chart.piecelabel.js'
import { isEmpty } from 'lodash'
import CircularProgress from 'material-ui/CircularProgress'
import * as React from 'react'
// import { Doughnut } from 'react-chartjs-2'
import { CENSUS_MAPPING } from '../../constants/census'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, PopulationByAdequacy } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceArea, summaryStatisticsByServiceAreaAndCensus } from '../../utils/data'
import { formatPercentage } from '../../utils/formatters'
import { getLegend } from '../MapLegend/MapLegend'
import { StatsBox } from '../StatsBox/StatsBox'
import './AdequacyCensusCharts.css'

type Props = {
  serviceAreas: string[],
  censusCategory: string
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
// (Chart as any).defaults.global.legend.labels.usePointStyle = true

export let AdequacyCensusCharts = withStore('adequacies', 'method')<Props>(({ serviceAreas, censusCategory, store }) => {
  if (isEmpty(store.get('adequacies'))) {
    return <div className='AdequacyCensusCharts Flex -Center'>
      <CircularProgress
        size={150}
        thickness={8}
        color={ADEQUACY_COLORS[AdequacyMode.ADEQUATE_15]}
      />
    </div>
  }

  let method = store.get('method')

  // Calculate summaryStatistics for each group.
  let populationByAdequacyByGroup = summaryStatisticsByServiceAreaAndCensus(serviceAreas, censusCategory, store)
  // Retrieve total population information for the selected service area.
  let totalPopulationByAdequacy = summaryStatisticsByServiceArea(serviceAreas, store)
  let censusGroups = CENSUS_MAPPING[censusCategory]
  // let summaryStatistics = populationByAdequacyByGroup[censusGroups[0]]

  return <div className='AdequacyCensusCharts'>
    <StatsBox className='HighLevelStats' withBorders>
      <tr>
        <th>Group</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_15)}</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_30)}</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_60)}</th>
        <th>{getLegend(method, AdequacyMode.INADEQUATE)}</th>
      </tr>
      {
        censusGroups.map(censusGroup =>
          adequacyRowByCensusGroup(censusGroup, populationByAdequacyByGroup[censusGroup], totalPopulationByAdequacy)
        )
      }
    </StatsBox>
  </div>
})

function adequacyRowByCensusGroup(censusGroup: string, populationByAdequacy: PopulationByAdequacy, totalPopulationByAdequacy: number[]) {
  return (
    <tr>
      <td>{censusGroup.replace('percent_', '')}</td>
      <td>{formatPercentage(100 * populationByAdequacy[0] / totalPopulationByAdequacy[0])}</td>
      <td>{formatPercentage(100 * populationByAdequacy[1] / totalPopulationByAdequacy[1])}</td>
      <td>{formatPercentage(100 * populationByAdequacy[2] / totalPopulationByAdequacy[2])}</td>
      <td>{formatPercentage(100 * populationByAdequacy[3] / totalPopulationByAdequacy[3])}</td>
    </tr>
  )
}
