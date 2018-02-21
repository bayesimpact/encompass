import RaisedButton from 'material-ui/RaisedButton'
import * as React from 'react'
import { Dataset } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
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
    <AnalyzerButton />
  </div>
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

function Analyze(store: Store) {
  if (store.get('providers').length && store.get('serviceAreas').length) {
    let dataSet: Dataset = {
      dataSources: [
        store.get('uploadedServiceAreasFilename') || 'No Service Areas',
        store.get('uploadedProvidersFilename') || 'No Providers'],
      description: 'Your own data',
      state: store.get('selectedState'),
      name: 'Your Data',
      providers: store.get('providers'),
      serviceAreaIds: store.get('serviceAreas'),
      hint: ''
    }
    // To Save dataSet, use - console.log(JSON.stringify(dataSet, null, 4))
    store.set('uploadedServiceAreasFilename')(null)
    store.set('uploadedProvidersFilename')(null)
    store.set('selectedDataset')(dataSet)
    return
  }
}
