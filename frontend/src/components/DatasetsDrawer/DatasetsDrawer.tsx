import { memoize } from 'lodash'
import * as React from 'react'
import { DATASETS } from '../../constants/datasets'
import { Dataset } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import { Tile, TilePicker } from '../TilePicker/TilePicker'
import './DatasetsDrawer.css'

const COLORS = [
  '#5f7c8a',
  '#47488e',
  '#478e8c',
  '#478e51',
  '#8e7947',
  '#8e4747',
  '#8e4770'
]

let toTiles = memoize((datasets: Dataset[]): Tile<Dataset>[] =>
  datasets.map((_, n) => ({
    color: COLORS[n],
    data: _,
    description: _.description,
    name: _.name
  }))
)

let tiles = toTiles(DATASETS)
let DatasetTilePicker = TilePicker<Dataset>()

export let DatasetsDrawer = withStore('selectedDataset')(({ store }) =>
  <div className='DatasetsDrawer'>
    <h2 className='Secondary'>Choose a dataset to explore</h2>
    <DatasetTilePicker
      onChange={tile => store.set('selectedDataset')(tile.data)}
      tiles={tiles}
      value={tiles.find(_ => _.data === store.get('selectedDataset')) || null}
    />
    <p className='Center LargeFont Muted'>Don't see the dataset you want? <a href='mailto:data@bayesimpact.org?subject=Request a dataset'>Email us</a>.</p>
  </div>
)
