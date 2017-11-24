import RaisedButton from 'material-ui/RaisedButton'
import * as React from 'react'
import './CSVUploader.css'

type Props = {
  onUpload(file: File): void
}

export let CSVUploader: React.StatelessComponent<Props> = ({ onUpload }) =>
  <div className='CSVUploader'>
    <RaisedButton
      containerElement='label'
      primary={true}
      label='upload CSV'
    >
      <input
        onChange={e => e.target.files && onUpload(e.target.files[0])}
        type='file'
        accept='.csv'
      />
    </RaisedButton>
  </div>
