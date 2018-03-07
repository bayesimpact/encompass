
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

SelectorBlock.displayName = 'SelectorBlock'
