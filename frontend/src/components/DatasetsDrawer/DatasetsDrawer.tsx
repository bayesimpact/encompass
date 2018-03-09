import { memoize } from 'lodash'
// import Add from 'material-ui/svg-icons/content/add-circle'
import * as React from 'react'
import { DATASET_COLORS } from '../../constants/colors'
import { DATASETS } from '../../constants/datasets'
import { Dataset } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { SecureLink } from '../../utils/link'
import { Tile, TilePicker } from '../TilePicker/TilePicker'
import './DatasetsDrawer.css'

export const UPLOAD_NEW_DATASET_TILE: Tile<Dataset> = {
  color: '#237900',
  description: 'Upload a list of addresses for providers, facilities, or social services',
  data: {
    dataSources: '',
    description: '',
    state: 'ca',
    name: '',
    hint: '',
    subtitle: '',
    providers: [],
    serviceAreaIds: []
  },
  name: <span>Analyze Your Own Data</span>
}

let toTiles = memoize((datasets: Dataset[]): Tile<Dataset>[] =>
  datasets.map((_, n) => ({
    color: DATASET_COLORS[n],
    data: _,
    description: _.subtitle,
    name: _.name
  })
  )
)

let tiles = [
  ...toTiles(DATASETS),
  ...(process.env.SHOULD_SHOW_CSV_UPLOADER ? [UPLOAD_NEW_DATASET_TILE] : [])
]
let DatasetTilePicker = TilePicker<Dataset>()

export let DatasetsDrawer = withStore('selectedDataset')(({ store }) =>
  <div className='DatasetsDrawer'>
    <p>Welcome to the Encompass analysis tool built by {SecureLink('http://bayesimpact.org', 'Beacon Labs')}.Choose one of the datasets below to begin exploring the accessibility of health care services in different regions of the U.S.</p>
    <p>To send us feedback or ideas for new datasets, you can contact us {SecureLink('mailto:encompass@bayesimpact.org?subject=Request a dataset', 'here')}.</p>
    <DatasetTilePicker
      onChange={onChange(store)}
      tiles={tiles}
      value={tiles.find(_ => _.data === store.get('selectedDataset')) || null}
    />
    <p className='Center LargeFont Muted'>Don't see the dataset you want? {SecureLink('mailto:encompass@bayesimpact.org?subject=Request a dataset', 'Email us')}.</p>
  </div>
)

function onChange(store: Store) {
  return (tile: Tile<Dataset>) => {
    if (tile === UPLOAD_NEW_DATASET_TILE) {
      // TODO: Show Analyze Your Own Dataset Modal modal
      store.set('route')('/add-data')
      return
    }
    store.set('selectedDataset')(tile.data)
  }
}
