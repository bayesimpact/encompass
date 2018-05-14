import * as React from 'react'
import { Route } from '../../constants/datatypes'
import { withStore } from '../../services/store'
import './Link.css'

type Props = {
  className?: string
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void
  to: Route
}

export let Link = withStore<Props>(({ children, className, onClick, store, to }) =>
  <a
    className={'Link ' + (className || '')}
    onClick={e => {
      e.preventDefault()
      if (onClick) {
        onClick(e)
      }
      store.set('route')(to)
    }}
  >{children}</a>
)
Link.displayName = 'Link'

export let BackLink = withStore(({ store }) =>
  <Link
    className='Muted Uppercase'
    onClick={() => {
      store.set('uploadedServiceAreasFilename')(null)
      store.set('uploadedProvidersFilename')(null)
      store.set('selectedDataset')(null)
    }
    }
    to='/datasets'
  > ⟵ Back to datasets</Link >
)
