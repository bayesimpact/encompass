
import * as React from 'react'
import { CONFIG } from '../../config/config'
import { withStore } from '../../services/store'
import { CensusCategorySelector } from './CensusCategorySelector'
import { FilterMethodSelector } from './FilterMethodSelector'
import { FormatSelector } from './FormatSelector'
import './SelectorBlock.css'
import { StateSelector } from './StateSelector'

// TODO - Consider abstracting the Selector class to avoid duplications.
export let SelectorBlock = withStore('selectedState')(({ store }) => {
    return (
        <div className='Selectors'>
            {store.get('selectedDataset') && store.get('selectedDataset')!.usaWide ? <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>State</h4>
                <StateSelector
                    className='Menu'
                    store={store}
                    value={store.get('selectedState')} />
            </div > : null}
            <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>County Filter</h4>
                <FilterMethodSelector
                    className='Menu'
                    onChange={store.set('selectedFilterMethod')}
                    value={store.get('selectedFilterMethod')}
                />
            </div>
            {CONFIG.is_census_data_available ? <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>Demographic</h4>
                <CensusCategorySelector
                    className='Menu'
                    onChange={store.set('selectedCensusCategory')}
                    value={store.get('selectedCensusCategory')}
                />
            </div > : null}
            <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>Values</h4>
                <FormatSelector
                    className='Menu'
                    onChange={store.set('selectedFormat')}
                    value={store.get('selectedFormat')}
                />
            </div>
        </div>
    )
})

SelectorBlock.displayName = 'SelectorBlock'
