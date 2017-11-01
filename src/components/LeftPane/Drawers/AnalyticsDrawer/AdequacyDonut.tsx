import { Chart, ChartData, ChartTooltipItem } from 'chart.js'
import 'chart.piecelabel.js'
import { keyBy, round } from 'lodash'
import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { StoreProps, withStore } from '../../../../services/store'

type Props = StoreProps & {
  serviceAreas: string[]
}

/**
 * Use circular legend patches instead of the default rectangles.
 *
 * TODO: Fix typings upstream in DefinitelyTyped/chart.js
 */
(Chart as any).defaults.global.legend.labels.usePointStyle = true

export let AdequacyDonut = withStore('adequacies')<Props>(({ serviceAreas, store }) => {

  let serviceAreasHash = keyBy(serviceAreas)
  let adequacies = store.get('adequacies')
  let rps = store.get('representativePoints')
  let rpsInServiceAreas = rps.filter(_ => _.service_area_id in serviceAreasHash)
  let adequateRpsInServiceAreas = rpsInServiceAreas.filter(_ => adequacies[_.id] === true)
  let adequatePercent = round(100 * adequateRpsInServiceAreas.length / rpsInServiceAreas.length, 1)

  return <Doughnut
    data={{
      labels: ['Adequate', 'Inadequate'],
      datasets: [{
        data: [adequatePercent, 100 - adequatePercent],
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
        precision: 1
      },
      tooltips: {
        callbacks: {
          label: label(
            adequateRpsInServiceAreas.length,
            rpsInServiceAreas.length - adequateRpsInServiceAreas.length
          )
        }
      }
    } as any}
  />
})

function label(withAccess: number, withoutAccess: number) {
  return (tooltipItem?: ChartTooltipItem, data?: ChartData) => {
    if (!tooltipItem || !data || !data.datasets) {
      return ''
    }
    switch (tooltipItem.index) {
      case 0: return `With access: ${withAccess} (${data.datasets[0].data![0]}%)`
      case 1: return `Without access: ${withoutAccess} (${data.datasets[0].data![1]}%)`
    }
  }
}
