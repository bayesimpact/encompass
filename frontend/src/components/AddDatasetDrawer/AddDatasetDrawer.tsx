import * as React from 'react'
import { withStore } from '../../services/store'

export let AddDatasetDrawer = withStore('selectedDataset')(({}) =>
  <div className='AddDatasetDrawer'>
    <h2 className='Secondary'>Upload your data to explore</h2>
    {/* <DatasetTilePicker
      onChange={onChange(store)}
      tiles={tiles}
      value={tiles.find(_ => _.data === store.get('selectedDataset')) || null}
    /> */}
  </div>
)
