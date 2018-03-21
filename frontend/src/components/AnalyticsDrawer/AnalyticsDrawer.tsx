import * as React from 'react'
import { withStore } from '../../services/store'
import { SecureLink } from '../../utils/link'
import { BackLink } from '../Link/Link'
import { SelectorBlock } from '../Selectors/SelectorBlock'
import './AnalyticsDrawer.css'
import { CensusAnalytics } from './CensusAnalytics'

/**
 * TODO: Show loading indicator while necessary data is being fetched.
 */
export let AnalyticsDrawer = withStore(
  'selectedDataset', 'selectedCensusCategory', 'selectedCounties',
  'selectedCountyType', 'selectedFormat', 'selectedServiceAreas', 'selectedFilterMethod')(({ store }) => {

    let selectedDataset = store.get('selectedDataset')

    if (!selectedDataset) {
      return <div className='AnalyticsDrawer'>
        <BackLink />
        <p>Error - Please reload the page</p>
      </div>
    }

    return <div className='AnalyticsDrawer'>
      <BackLink />
      <h2 className='Secondary'>{selectedDataset.name}</h2>
      <div className='Description'>
        <h4 className='HeavyWeight Muted'>Description</h4>
        <div dangerouslySetInnerHTML={{ __html: selectedDataset.description }} />
      </div>
      <div className='Selectors'>
        <SelectorBlock />
      </div>
      <div className='CensusAnalytics'>
        <CensusAnalytics />
      </div>
      <div className='Description'>
        <h4 className='HeavyWeight Muted'>Data Sources</h4>
        <div>
          <div dangerouslySetInnerHTML={{ __html: selectedDataset.dataSources }} />
          <br />
          Population Data: European Commission, Joint Research Centre (JRC); Columbia University, Center for International Earth Science Information Network
           - CIESIN (2015): GHS population grid, derived from GPW4, multitemporal (1975, 1990, 2000, 2015).
           European Commission, Joint Research Centre (JRC) {SecureLink('http://data.europa.eu/89h/jrc-ghsl-ghs_pop_gpw4_globe_r2015a', '[Dataset]')}.
           <br /><br />
          Demographic Information: 2012-2016 American Community Survey 5-year estimates. {SecureLink('https://www.census.gov/programs-surveys/acs/news/data-releases/2016/release.html', 'U.S. Census Bureau.')}.
        </div>
      </div>
    </div>
  })
