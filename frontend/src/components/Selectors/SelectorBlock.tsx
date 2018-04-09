
import * as React from 'react'
import { CONFIG } from '../../config/config'
import { FilterMethod } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { CensusCategorySelector } from './CensusCategorySelector'
import { CountyTypeSelector } from './CountyTypeSelector'
import { FilterMethodSelector } from './FilterMethodSelector'
import { FormatSelector } from './FormatSelector'
import './SelectorBlock.css'
import { ServiceAreaSelector } from './ServiceAreaSelector'

// TODO - Consider abstracting the Selector class to avoid duplications.
export let SelectorBlock = withStore()(({ store }) => {
    return (
        <div className='Selectors'>
            {CONFIG.is_census_data_available ? <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>Demographic</h4>
                <CensusCategorySelector
                    className='Menu'
                    onChange={store.set('selectedCensusCategory')}
                    value={store.get('selectedCensusCategory')}
                />
            </div > : null}
            <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>Filter By</h4>
                <FilterMethodSelector
                    className='Menu'
                    onChange={store.set('selectedFilterMethod')}
                    value={store.get('selectedFilterMethod')}
                />
                {selectorByMethod(store.get('selectedFilterMethod'), store)}
            </div>
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

function selectorByMethod(method: FilterMethod, store: Store) {
    if (method === 'County Name') {
        return <ServiceAreaSelector
            className='Menu MultiSelect'
            onChange={store.set('selectedCounties')}
            values={store.get('selectedCounties')}
        />
    }
    if (method === 'County Type') {
        return <CountyTypeSelector
            className='Menu'
            onChange={store.set('selectedCountyType')}
            value={store.get('selectedCountyType')}
        />
    }
    return null
}

SelectorBlock.displayName = 'SelectorBlock'
