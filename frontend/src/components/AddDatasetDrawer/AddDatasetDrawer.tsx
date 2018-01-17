import * as React from 'react'
import { withStore } from '../../services/store'
import { BackLink } from '../Link/Link'
import { ProvidersUplodader } from '../Uploader/ProvidersUplodader'
import { ServiceAreasUploader } from '../Uploader/ServiceAreasUplodader'

export let AddDatasetDrawer = withStore('selectedDataset')(({}) =>
  <div className='AddDatasetDrawer'>
    <BackLink/>
    <h2 className='Secondary'>Upload your data to explore</h2>
    <ServiceAreasUploader/>
    <ProvidersUplodader/>
  </div>
)
