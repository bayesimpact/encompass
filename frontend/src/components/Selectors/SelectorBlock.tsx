
import * as React from 'react'
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
            <div className='SelectorRow'>
                <body className='HeavyWeight Muted'>Demographic</body>
                <CensusCategorySelector
                    className='Menu'
                    onChange={store.set('selectedCensusCategory')}
                    value={store.get('selectedCensusCategory')}
                />
            </div>
            <div className='SelectorRow'>
                <body className='HeavyWeight Muted'>Filter By</body>
                <FilterMethodSelector
                    className='Menu'
                    onChange={store.set('selectedFilterMethod')}
                    value={store.get('selectedFilterMethod')}
                />
                {selectorByMethod(store.get('selectedFilterMethod'), store)}
            </div>
            <div className='SelectorRow'>
                <body className='HeavyWeight Muted'>Values</body>
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
