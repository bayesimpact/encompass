import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import { Dataset } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { download } from '../../utils/download'
import { BackLink } from '../Link/Link'
import { ProvidersUploader } from '../Uploader/ProvidersUploader'
import { ServiceAreasUploader } from '../Uploader/ServiceAreasUploader'

import './AddDatasetDrawer.css'

export let AddDatasetDrawer = withStore('selectedDataset')(({ }) =>
  <div className='AddDatasetDrawer'>
    <BackLink />
    <h2 className='Secondary'>Upload your data to explore</h2>
    <p className='MediumWeight Muted'>
      To analyze the accessibility of your own set of providers, facilities, or social services, you
      will need to upload two separate CSV files:
      <ul>
        <li>List of service areas (County and/or ZIP columns).</li>
        <li>List of addresses for providers or services.</li>
      </ul>
    </p>
    <ServiceAreasUploader />
    <ProvidersUploader />
    <DownloadDatasetLink />
    <AnalyzerButton />
  </div >
)

let AnalyzerButton = withStore('uploadedProvidersFilename')(({ store }) =>
  <div className='Flex -Center'>
    <RaisedButton
      className={'Button -Primary'}
      containerElement='label'
      primary={true}
      label='Analyze'
      onClick={_ => { Analyze(store) }}
    />
  </div>
)

function createDataset(store: Store) {
  let dataSet: Dataset = {
    dataSources: [
      store.get('uploadedServiceAreasFilename') || 'No Service Areas',
      store.get('uploadedProvidersFilename') || 'No Providers'],
    description: 'Your own data',
    state: store.get('selectedState'),
    name: 'Your Data',
    providers: store.get('providers'),
    serviceAreaIds: store.get('serviceAreas'),
    hint: '',
    subtitle: ''
  }
  return dataSet
}

function Analyze(store: Store) {
  if (store.get('providers').length && store.get('serviceAreas').length) {
    let dataSet = createDataset(store) || null
    store.set('selectedDataset')(dataSet)
    // Re-initialize filenames.
    store.set('uploadedServiceAreasFilename')(null)
    store.set('uploadedProvidersFilename')(null)
    return
  }
}

let DownloadDatasetLink = withStore()(({ store }) =>
  <FlatButton
    className='DownloadDatasetLink Button -Primary'
    icon={<DownloadIcon />}
    label='Save JSON'
    labelPosition='before'
    onClick={onClick(store)}
  />
)

function onClick(store: Store) {
  return () => {
    let dataset = createDataset(store)
    let jsonDataset = JSON.stringify(dataset, null, 4)
    download(jsonDataset, 'json', `bayesimpact-dataset-${dataset.dataSources.join('_')}.json`)
  }
}
