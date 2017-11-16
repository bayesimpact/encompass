import { Store } from 'babydux'
import { chain } from 'lodash'
import { RaisedButton } from 'material-ui'
import { store, withStore, Actions } from '../../services/store'
import { getAdequacies } from  '../../services/api'
import { Measure, Standard } from '../../constants/datatypes'
import { TIME_DISTANCES } from '../../constants/timeDistances'
import * as React from 'react'
import './Refresh.css'


function isAdequate(
  distance: number,
  time: number,
  measure: Measure,
  standard: Standard
) {
  switch (standard) {
    case 'distance':
      return distance < measure
    case 'time_distance':
      return distance < measure && time < TIME_DISTANCES.get(measure)!
    case 'time':
      return time < TIME_DISTANCES.get(measure)!
  }
}

async function recomputeAdequacies(store: Store<Actions>) {
  store.set('adequacyComputationInProgress')(true)
  let providers = store.get('providers')
  let representativePoints = store.get('representativePoints')
  let adequacies = await getAdequacies(providers.map(_ => _.id), store.get('serviceAreas'))
  let measure = store.get('measure')
  let standard = store.get('standard')
  store.set('adequacies')(
    chain(representativePoints.map(_ => _.id))
      .zipObject(adequacies)
      .mapValues(_ => ({
        isAdequate: isAdequate(
          _.distance_to_closest_provider,
          _.time_to_closest_provider,
          measure,
          standard
        ),
        id: _.id,
        distanceToClosestProvider: _.distance_to_closest_provider,
        timeToClosestProvider: _.time_to_closest_provider,
        closestProviderByDistance: _.closest_provider_by_distance,
        closestProviderByTime: _.closest_provider_by_time
      }))
      .value()
  )
  store.set('adequaciesComputed')(true)
  store.set('adequacyComputationInProgress')(false)
}


export let Refresh = withStore('adequaciesComputed', 'adequacyComputationInProgress', )(() =>
  <div className='RefreshButton'>
    <RaisedButton
      primary={true}
      label='Compute'
      onClick={(event: object) => recomputeAdequacies(store)}
      style={{display: store.get('adequaciesComputed') ? 'none' : 'block'}} />
  </div>
)