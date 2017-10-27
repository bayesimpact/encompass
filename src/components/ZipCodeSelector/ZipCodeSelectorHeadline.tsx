import * as React from 'react'

type Props = {
  nSelectedCountyZips: number
}

export let ZipCodeSelectorHeadline = ({ nSelectedCountyZips }) =>
  <div className='ZipCodeSelectorHeadline'>
    Zip Codes
    <div className='PullRight'>
      {nSelectedCountyZips} selected
    </div>
  </div>
