import { Drawer } from 'material-ui'
import * as React from 'react'
import { store } from '../../services/store'
import { parseCSV } from '../../utils/csv'
import { CSVUploader } from '../CSVUploader/CSVUploader'

type State = {
  file?: File
}

export class ServiceAreas extends React.Component {
  state: State = {}

  render() {
    return <Drawer className='LeftDrawer' open={true}>
      <h2>Service Areas</h2>
      <CSVUploader onUpload={this.onFileSelected} />
      <p className='Ellipsis Muted SmallFont'>{
        this.state.file
          ? `Uploaded ${this.state.file.name}`
          : 'Upload valid zip codes and/or counties'
      }</p>
    </Drawer>
  }

  onFileSelected = async (file: File) => {
    this.setState({ file })
    let serviceAreas = await parseServiceAreasCSV(file)
    store.set('serviceAreas', serviceAreas) // TODO: use withStore HOC instead
  }

}

/**
 * TODO: Fuzzy matching for column names
 * TODO: Expose parse error to user
 * TODO: Verify that each zip code actually belongs to the given ServiceArea
 * TODO: Map ServiceAreas and ZipCodes to their corresponding IDs
 */
async function parseServiceAreasCSV(file: File): Promise<[string, number][]> {
  let csv = await parseCSV<string[]>(file)
  let countyIndex = csv[0].indexOf('CountyName')
  let zipIndex = csv[0].indexOf('ZipCode')
  if (countyIndex < 0 || zipIndex < 0) {
    throw 'CSV must define columns "CountyName" and "ZipCode"'
  }

  return csv
    .slice(1)                       // ignore header row
    .filter(([_]) => _ !== '')      // ignore empty rows
    .map(_ => [
      _[countyIndex],
      Number(_[zipIndex])           // in case zip code isn't a number already
    ] as [string, number])
}
