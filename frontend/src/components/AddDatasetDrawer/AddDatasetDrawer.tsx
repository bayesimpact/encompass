import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import DownloadIcon from 'material-ui/svg-icons/file/file-download'
import * as React from 'react'
import { Dataset } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { download } from '../../utils/download'
import { SecureLink } from '../../utils/link'
import { BackLink } from '../Link/Link'
import { StateCountySelector } from '../StateCountySelector/StateCountySelector'
import { ProvidersUploader } from '../Uploader/ProvidersUploader'
import { ServiceAreasUploader } from '../Uploader/ServiceAreasUploader'
import './AddDatasetDrawer.css'

const { ENV } = process.env
const githubLink = SecureLink('https://github.com/bayesimpact/encompass', 'GitHub')
const contactUsLink = SecureLink('mailto:encompass@bayesimpact.org?subject=Driving%Time%20Analysis', 'contact us')

export let AddDatasetDrawer = withStore('selectedDataset', 'useCustomCountyUpload')(({ store }) =>
  <div className='AddDatasetDrawer'>
    <BackLink />
    <h2 className='Secondary'>Upload your data to explore</h2>
    <div className='ExplainerText'>
      <span className='MediumWeight'>
        To analyze the accessibility of your own set of providers, facilities, or social services:
        <ul>
          <li>Isolate the population you want to analyze by selecting a state</li>
          <li>Upload a CSV of locations representing providers or services. The header row must define "latitude" and "longitude" columns (and an optional "name" column).</li>
        </ul>
        For simplicity, this analysis will only produce results using straight-line distance. To run your own analysis using driving times, visit our {githubLink} page or {contactUsLink} to learn how.
      </span>
    </div>
    <StateCountySelector />
    {store.get('useCustomCountyUpload') ? <ServiceAreasUploader /> : null}
    <ProvidersUploader />
    <div className='AnalyzeButton -Center'>
      {(ENV !== 'PRD') ? <DownloadDatasetLink /> : null}
      <AnalyzerButton />
    </div>
  </div >
)

let AnalyzerButton = withStore('uploadedProvidersFilename')(({ store }) =>
  <div>
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
      store.get('uploadedServiceAreasFilename') || store.get('selectedState').toUpperCase(),
      store.get('uploadedProvidersFilename') || 'No Providers'
    ].join(', '),
    description: [
      store.get('uploadedServiceAreasFilename') || store.get('selectedState').toUpperCase(),
      store.get('uploadedProvidersFilename') || 'No Providers'
    ].join(', '),
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
  <div>
    <FlatButton
      className='DownloadDatasetLink Button -Primary'
      icon={<DownloadIcon />}
      label='Save JSON'
      labelPosition='before'
      onClick={onClick(store)}
    />
  </div>
)

function onClick(store: Store) {
  return () => {
    let dataset = createDataset(store)
    let jsonDataset = JSON.stringify(dataset, null, 4)
    // Sample filename: encompass-dataset-tx-9-providers-2018-03-06.json
    download(jsonDataset, 'json', `encompass-dataset-${dataset.state}-${dataset.providers.length}-providers-${new Date().toJSON().slice(0, 10)}.json`)
  }
}
