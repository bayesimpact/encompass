import FlatButton from 'material-ui/RaisedButton'
import * as React from 'react'
import './CSVUploader.css'

type Props = {
  className?: string,
  label: string
  onUpload(file: File): void
}

export let CSVUploader: React.StatelessComponent<Props> = ({ label, onUpload }) =>
  <div className='CSVUploader'>
    <FlatButton
      className='CSVUploader Button -Secondary -Flex-0'
      label={label}
      labelPosition='before'
      containerElement='label'
    >
      <input
        onChange={e => {
          if (e.target.files) {
            onUpload(e.target.files[0])
          }
          e.currentTarget.value = ''
        }
        }
        type='file'
        accept='.csv'
      />
    </FlatButton>
  </div >
CSVUploader.displayName = 'CSVUploader'
