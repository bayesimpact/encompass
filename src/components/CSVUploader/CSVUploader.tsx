import { RaisedButton } from 'material-ui'
import * as React from 'react'
import './CSVUploader.css'

type Props = {
  onFileSelected(file: File): void
  selectedCSVFileName: string
}

export let CSVUploader: React.StatelessComponent<Props> = ({ onFileSelected, selectedCSVFileName }) =>
  <div className='CSVUploader'>
    <RaisedButton
      containerElement='label'
      primary={true}
      label='upload CSV'
    >
      <input
        onChange={e => onFileSelected(e.target.files[0])}
        type='file'
        accept='.csv'
      />
    </RaisedButton>
    <div className='UploadMessage'>{
      selectedCSVFileName
        ? `Uploaded - ${selectedCSVFileName}`
        : `Upload valid ZIP Codes and/or Counties`
    }</div>
  </div>
