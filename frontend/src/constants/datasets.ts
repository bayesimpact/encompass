import { Dataset } from './datatypes'
import { SERVICE_AREAS_BY_STATE } from './zipCodes'

export let DATASETS: Dataset[] = [
  // FIXME: Programatically read in datasets.
  // TODO: If no service area IDs, then assume full state.
  // tslint:disable:no-var-requires
  emptyListToFullState(require('./datasets/MS_HCSD_and_Look-Alike_MS.json')),
  emptyListToFullState(require('./datasets/FL_HCSD_and_Look-Alike_FL.json')),
  emptyListToFullState(require('./datasets/FL_fl_endocrinologists.json')),
  emptyListToFullState(require('./datasets/TX_HCSD_and_Look-Alike_TX.json')),
  emptyListToFullState(require('./datasets/TX_texas_abortion_clinics_address_mar2017.json'))
]

function emptyListToFullState(dataset: Dataset) {
  if (dataset.serviceAreaIds.length === 0) {
    dataset.serviceAreaIds = SERVICE_AREAS_BY_STATE[dataset.state]
  }
  return dataset
}
