
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
                <body className='HeavyWeight Muted'>Demographic</body>
                <CensusCategorySelector
                    className='Menu'
                    onChange={store.set('selectedCensusCategory')}
                    value={store.get('selectedCensusCategory')}
                />
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

SelectorBlock.displayName = 'SelectorBlock'
