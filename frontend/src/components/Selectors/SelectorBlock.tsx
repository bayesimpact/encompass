
import * as React from 'react'
import { SelectorMethod } from '../../constants/datatypes'
import { Store, withStore } from '../../services/store'
import { CensusCategorySelector } from './CensusCategorySelector'
import { CountyTypeSelector } from './CountyTypeSelector'
import { FilterMethodSelector } from './FilterMethodSelector'
import { FormatSelector } from './FormatSelector'
import './SelectorBlock.css'
import { ServiceAreaSelector } from './ServiceAreaSelector'

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
                    onChange={store.set('selectorMethod')}
                    value={store.get('selectorMethod')}
                />
                {selectorByMethod(store.get('selectorMethod'), store)}
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

function selectorByMethod(method: SelectorMethod, store: Store) {
    if (method === 'County Name') {
        store.set('selectedCountyType')(null)
        return <ServiceAreaSelector
            className='Menu'
            onChange={store.set('selectedCounties')}
            value={store.get('selectedCounties')}
        />
    }
    if (method === 'County Type') {
        store.set('selectedCounties')(null)
        return <CountyTypeSelector
            className='Menu'
            onChange={store.set('selectedCountyType')}
            value={store.get('selectedCountyType')}
        />
    }
    return null
}

SelectorBlock.displayName = 'SelectorBlock'
