import { Dataset } from './datatypes'

export let DATASETS: Dataset[] = [
  // tslint:disable:no-var-requires
  require('./datasets/MS_HCSD_and_Look-Alike_MS.json'),
  require('./datasets/FL_HCSD_and_Look-Alike_FL.json'),
  require('./datasets/FL_fl_endocrinologists.json'),
  require('./datasets/TX_HCSD_and_Look-Alike_TX.json'),
  require('./datasets/TX_texas_abortion_clinics_address_mar2017.json')
]
