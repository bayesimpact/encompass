import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'
import './CSVUploader.css'

const { ENV } = process.env

type Props = {
  className?: string,
  label: string
  onUpload(file: File): void
}

export let CSVUploader: React.StatelessComponent<Props> = ({ label, onUpload }) =>
  <div>
    <FlatButton
      className='CSVUploader Button -Secondary'
      label={label}
      labelPosition='before'
      containerElement='label'
    >
      <input
        onChange={e => {
          if (e.target.files) {
            const fileSize = e.target.files[0].size / 1024 / 1024 // in MB
            if (ENV === 'PRD' && fileSize > 15) {
              alert('File size exceeds 15 MB. Please try a smaller file.')
            } else {
              onUpload(e.target.files[0])
            }
            e.currentTarget.value = ''
          }
        }}
        type='file'
        accept='.csv'
      />
    </FlatButton>
  </div>
CSVUploader.displayName = 'CSVUploader'
