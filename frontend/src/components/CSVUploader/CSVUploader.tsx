import FlatButton from 'material-ui/FlatButton'
import * as React from 'react'
import { CONFIG } from '../../config/config'
import { withStore } from '../../services/store'
import './CSVUploader.css'

type Props = {
  label: string
  onUpload(file: File): void
}

export let CSVUploader = withStore<Props>(({ label, onUpload, store }) =>
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
            if (CONFIG.limit_upload_file_size && fileSize > 15) {
              store.set('alert')('File size exceeds 15 MB. Please try a smaller file.')
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
)
CSVUploader.displayName = 'CSVUploader'
