import { keyBy, round } from 'lodash'
import * as React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { StoreProps, withStore } from '../../../../services/store'

type Props = StoreProps & {
  serviceAreas: string[]
}

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
      }
    }}
  />
})
