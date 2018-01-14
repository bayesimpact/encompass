import * as React from 'react'
import { Route } from '../../constants/datatypes'
import { StoreProps, withStore } from '../../services/store'
import './Link.css'

type Props = {
  className?: string
  onClick?(e: React.MouseEvent<HTMLAnchorElement>): void
  to: Route
}

export let Link = withStore()<Props & StoreProps>(({ children, className, onClick, store, to }) =>
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
