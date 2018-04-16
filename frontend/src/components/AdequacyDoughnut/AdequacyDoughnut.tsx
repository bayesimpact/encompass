import { Chart, ChartData, ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import { isEmpty } from 'lodash'
import CircularProgress from 'material-ui/CircularProgress'
import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode, Method } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { summaryStatisticsByServiceArea } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'
import { getLegend } from '../MapLegend/MapLegend'
import { StatsBox } from '../StatsBox/StatsBox'

type Props = {
  serviceAreas: string[]
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
(Chart as any).defaults.global.legend.labels.usePointStyle = true

export let AdequacyDoughnut = withStore('adequacies', 'method')<Props>(({ serviceAreas, store }) => {

  if (isEmpty(store.get('adequacies'))) {
    return <div className='AdequacyDoughnut Flex -Center'>
      <CircularProgress
        size={150}
        thickness={8}
        color={ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0]}
      />
    </div>
  }

  let populationByAdequacy = summaryStatisticsByServiceArea(serviceAreas, store)

  let totalPopulation = populationByAdequacy.reduce(function (a, b) { return a + b }, 0)
  let method = store.get('method')

  return <div className='AdequacyDoughnut'>
    <Doughnut
      data={{
        labels: [
          getLegend(method, AdequacyMode.ADEQUATE_0),
          getLegend(method, AdequacyMode.ADEQUATE_1),
          getLegend(method, AdequacyMode.ADEQUATE_2),
          getLegend(method, AdequacyMode.INADEQUATE)
        ],
        datasets: [{
          data: populationByAdequacy,
          backgroundColor: [
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_0],
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_1],
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_2],
            ADEQUACY_COLORS[AdequacyMode.INADEQUATE]
          ]
        }]
      }}
      options={{
        legend: {
          fullWidth: false,
          position: 'right'
        },
        // @see https://github.com/emn178/Chart.PieceLabel.js
        pieceLabel: {
          fontColor: '#333',
          position: 'outside',
          precision: 1
        },
        tooltips: {
          callbacks: {
            label: label(populationByAdequacy)
          }
        }
      } as any}
    />
    <StatsBox className='HighLevelStats' withBorders>
      <tr>
        <th>Access</th>
        <th>Population (%)</th>
        <th>Population (#)</th>
      </tr>
      {adequacyRow(populationByAdequacy[0], totalPopulation, method, AdequacyMode.ADEQUATE_0)}
      {adequacyRow(populationByAdequacy[1], totalPopulation, method, AdequacyMode.ADEQUATE_1)}
      {adequacyRow(populationByAdequacy[2], totalPopulation, method, AdequacyMode.ADEQUATE_2)}
      {adequacyRow(populationByAdequacy[3], totalPopulation, method, AdequacyMode.INADEQUATE)}
    </StatsBox>
  </div>
})

function adequacyRow(populationByAdequacy: number, totalPopulation: number, method: Method, adequacyMode: AdequacyMode) {
  return (
    <tr>
      <td>{getLegend(method, adequacyMode)}</td>
      <td>{formatPercentage(100 * populationByAdequacy / totalPopulation)}</td>
      <td>{formatNumber(populationByAdequacy)}</td>
    </tr>
  )
}
function label(populationByAdequacy: number[]) {
  return (tooltipItem?: ChartTooltipItem, data?: ChartData) => {
    if (!tooltipItem || !data || !data.datasets) {
      return ''
    }
    let totalPopulation = populationByAdequacy.reduce(function (a, b) { return a + b }, 0)
    let index = tooltipItem.index || 0
    let population = populationByAdequacy[index]
    let percentage = 100 * populationByAdequacy[index] / totalPopulation
    return ` ${formatNumber(population)} (${formatPercentage(percentage)})`
  }
}
