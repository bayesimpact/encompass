import { Chart, ChartData, ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { ADEQUACY_COLORS } from '../../constants/colors'
import { AdequacyMode } from '../../constants/datatypes'
import { StoreProps, withStore } from '../../services/store'
import { summaryStatistics } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'
import  { getLegend } from '../MapLegend/MapLegend'
import { StatsBox } from '../StatsBox/StatsBox'
import './AdequacyDoughnut.css'

type Props = StoreProps & {
  serviceAreas: string[]
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
(Chart as any).defaults.global.legend.labels.usePointStyle = true

export let AdequacyDoughnut = withStore('adequacies', 'method')<Props>(({ serviceAreas, store }) => {

  let {
    numAdequatePopulation,
    numInadequatePopulation,
    percentAdequatePopulation,
    percentInadequatePopulation,
    populationByAdequacy
  } = summaryStatistics(serviceAreas, store)

  return <div className='AdequacyDoughnut'>
    <Doughnut
      data={{
        labels: [
          getLegend(store.get('method'), AdequacyMode.ADEQUATE_15),
          getLegend(store.get('method'), AdequacyMode.ADEQUATE_30),
          getLegend(store.get('method'), AdequacyMode.ADEQUATE_60),
          getLegend(store.get('method'), AdequacyMode.INADEQUATE)
        ],
        datasets: [{
          data: populationByAdequacy,
          backgroundColor: [
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_15],
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_30],
            ADEQUACY_COLORS[AdequacyMode.ADEQUATE_60],
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
        <th>Service Areas</th>
        <th>Population</th>
        <th>Providers</th>
      </tr>
      <tr>
        <td>{serviceAreas.length.toLocaleString()}</td>
        <td>{(numAdequatePopulation + numInadequatePopulation).toLocaleString()}</td>
        <td>{store.get('providers').length.toLocaleString()}</td>
      </tr>
    </StatsBox>
    <StatsBox withBorders>
      <tr>
        <th>Adequate Access</th>
        <th>Inadequate Access</th>
      </tr>
      <tr>
        <td>{formatNumber(numAdequatePopulation)} ({formatPercentage(percentAdequatePopulation)})</td>
        <td>{formatNumber(numInadequatePopulation)} ({formatPercentage(percentInadequatePopulation)})</td>
      </tr>
    </StatsBox>
  </div>
})

function label(populationByAdequacy: number[]) {
  return (tooltipItem?: ChartTooltipItem, data?: ChartData) => {
    if (!tooltipItem || !data || !data.datasets) {
      return ''
    }
    let totalPopulation = populationByAdequacy.reduce(function(a, b) { return a + b }, 0)
    let index = tooltipItem.index || 0
    let population = populationByAdequacy[index]
    let percentage = 100 * populationByAdequacy[index] / totalPopulation
    return ` ${formatNumber(population)} (${formatPercentage(percentage)})`
  }
}
