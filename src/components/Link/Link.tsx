import * as React from 'react'
import { Route } from '../../constants/datatypes'
import { StoreProps, withStore } from '../../services/store'

type Props = {
  className?: string
  to: Route
}

export let Link = withStore()<Props & StoreProps>(({ children, className, store, to }) =>
  <a
    className={className || ''}
    onClick={e => e.preventDefault() || store.set('route')(to)}
  >{children}</a>
)
Link.displayName = 'Link'
