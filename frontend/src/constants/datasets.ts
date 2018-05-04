import { Dataset } from './datatypes'
import { SERVICE_AREAS_BY_STATE } from './zipCodes'

export let DATASETS: Dataset[] = [
  // FIXME: Programatically read in datasets.
  // tslint:disable:no-var-requires
  inferServiceAreaIds(require('./datasets/US_mental_health.json')),
  inferServiceAreaIds(require('./datasets/US_snap_farmers_markets.json')),
  inferServiceAreaIds(require('./datasets/TX_texas_abortion_clinics_address_mar2017.json')),
  inferServiceAreaIds(require('./datasets/TX_HCSD_and_Look-Alike_TX.json')),
  inferServiceAreaIds(require('./datasets/MS_HCSD_and_Look-Alike_MS.json')),
  inferServiceAreaIds(require('./datasets/FL_HCSD_and_Look-Alike_FL.json')),
  inferServiceAreaIds(require('./datasets/FL_fl_endocrinologists.json'))
]

export function inferServiceAreaIds(dataset: Dataset) {
  if (dataset.serviceAreaIds.length === 0) {
    dataset.serviceAreaIds = SERVICE_AREAS_BY_STATE[dataset.state]
  }
  return dataset
}
