
import * as React from 'react'
import { withStore } from '../../services/store'
import { CensusCategorySelector } from './CensusCategorySelector'
import { FormatSelector } from './FormatSelector'
import './SelectorBlock.css'

// TODO - Consider abstracting the Selector class to avoid duplications.
export let SelectorBlock = withStore()(({ store }) => {
    return (
        <div className='Selectors'>
            <div className='SelectorRow'>
                <h4 className='HeavyWeight Muted'>Demographic</h4>
                <CensusCategorySelector
                    className='Menu'
                    onChange={store.set('selectedCensusCategory')}
                    value={store.get('selectedCensusCategory')}
                />
            </div>
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
