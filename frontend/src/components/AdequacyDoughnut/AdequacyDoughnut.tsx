import { Chart, ChartData, ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { StoreProps, withStore } from '../../services/store'
import { summaryStatistics } from '../../utils/data'
import { formatNumber, formatPercentage } from '../../utils/formatters'
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

export let AdequacyDoughnut = withStore('adequacies')<Props>(({ serviceAreas, store }) => {

  let {
    numAdequatePopulation,
    numInadequatePopulation,
    percentAdequatePopulation,
    percentInadequatePopulation,
    numAdequateRps,
    numInadequateRps
  } = summaryStatistics(serviceAreas, store)

  return <div className='AdequacyDoughnut'>
    <Doughnut
      data={{
        labels: ['Adequate', 'Inadequate'],
        datasets: [{
          data: [percentAdequatePopulation, percentInadequatePopulation],
          backgroundColor: ['#3F51B5', 'rgba(214, 40, 41, 0.87)']
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
          precision: 2
        },
        tooltips: {
          callbacks: {
            label: label(numAdequatePopulation, numInadequatePopulation, percentAdequatePopulation, percentInadequatePopulation)
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
      <tr>
        <th>Adequate Points</th>
        <th>Inadequate Points</th>
      </tr>
      <tr>
        <td>{formatNumber(numAdequateRps)}</td>
        <td>{formatNumber(numInadequateRps)}</td>
      </tr>
    </StatsBox>
  </div>
})

function label(withAccess: number, withoutAccess: number, withAccessPercentage: number, withoutAccessPercentage: number) {
  return (tooltipItem?: ChartTooltipItem, data?: ChartData) => {
    if (!tooltipItem || !data || !data.datasets) {
      return ''
    }
    switch (tooltipItem.index) {
      case 0: return ` With access: ${formatNumber(withAccess)} (${formatPercentage(withAccessPercentage)})`
      case 1: return ` Without access: ${formatNumber(withoutAccess)} (${formatPercentage(withoutAccessPercentage)})`
    }
  }
}