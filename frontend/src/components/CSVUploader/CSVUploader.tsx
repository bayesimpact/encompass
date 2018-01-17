import RaisedButton from 'material-ui/RaisedButton'
import * as React from 'react'
import './CSVUploader.css'

type Props = {
  className?: string,
  label: string
  onUpload(file: File): void
}

export let CSVUploader: React.StatelessComponent<Props> = ({ className, label, onUpload }) =>
  <div className='CSVUploader'>
    <RaisedButton
      className={'Button -Primary ' + (className || '')}
      containerElement='label'
      primary={true}
      label={label}
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
    </RaisedButton>
  </div>
CSVUploader.displayName = 'CSVUploader'
