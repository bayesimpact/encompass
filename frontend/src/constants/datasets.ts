import { Dataset } from './datatypes'
// import { CaliforniaFKMServiceAreas } from './states'
import { SERVICE_AREAS_BY_STATE } from './zipCodes'

export let DATASETS: Dataset[] = [
  // tslint:disable:no-var-requires
  inferServiceAreaIds(require('./datasets/tanzania_healthsites.json')),
  inferServiceAreaIds(require('./datasets/colombia_school_connectivity.json'))
]

function inferServiceAreaIds(dataset: Dataset) {
  if (dataset.serviceAreaIds.length === 0) {
    dataset.serviceAreaIds = SERVICE_AREAS_BY_STATE[dataset.state]
  }
  return dataset
}
