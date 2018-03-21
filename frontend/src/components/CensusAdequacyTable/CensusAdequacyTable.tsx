import 'chart.piecelabel.js'
import 'chartjs-plugin-stacked100'
import { isEmpty } from 'lodash'
import CircularProgress from 'material-ui/CircularProgress'
import * as React from 'react'
import { CENSUS_MAPPING } from '../../constants/census'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Format, PopulationByAdequacy } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceAreaAndCensus } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'
import { getLegend } from '../MapLegend/MapLegend'
import { StatsBox } from '../StatsBox/StatsBox'

type Props = {
  serviceAreas: string[],
  censusCategory: string
}

// Force first column to be larger than the other ones.
let firstColumnStyle = {
  width: '30%'
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
// (Chart as any).defaults.global.legend.labels.usePointStyle = true

export let CensusAdequacyTable = withStore('adequacies', 'method')<Props>(({ serviceAreas, censusCategory, store }) => {
  if (isEmpty(store.get('adequacies'))) {
    return <div className='CensusAdequacyTable Flex -Center'>
      <CircularProgress
        size={150}
        thickness={8}
        color={ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0]}
      />
    </div>
  }

  let format = store.get('selectedFormat')
  let method = store.get('method')

  // Calculate summaryStatistics for each group.
  let populationByAdequacyByGroup = summaryStatisticsByServiceAreaAndCensus(serviceAreas, censusCategory, store)
  let censusGroups = ['Total Population'].concat(CENSUS_MAPPING[censusCategory])

  return <div>
    <StatsBox className='HighLevelStats' withBorders withFixedColumns>
      <tr>
        <th style={firstColumnStyle}>Group</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_0)}</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_1)}</th>
        <th>{getLegend(method, AdequacyMode.ADEQUATE_2)}</th>
        <th>{getLegend(method, AdequacyMode.INADEQUATE)}</th>
      </tr>
      {
        censusGroups.map(censusGroup =>
          adequacyRowByCensusGroup(censusGroup, populationByAdequacyByGroup[censusGroup], format)
        )
      }
    </StatsBox>
  </div>
})

function adequacyRowByCensusGroup(censusGroup: string, populationByAdequacy: PopulationByAdequacy, format: Format) {
  let totalPopulation = populationByAdequacy.reduce((a: number, b: number) => a + b)
  return (
    <tr>
      <td>{censusGroup}</td>
      {
        populationByAdequacy.map(_ => {
          if (format === 'Percentage') {
            return (<td className='NumericTableCell'>{formatPercentage(100 * _ / totalPopulation)}</td>)
          } else {
            return (<td className='NumericTableCell'>{formatNumber(_)}</td>)
          }
        })
      }
    </tr>
  )
}
