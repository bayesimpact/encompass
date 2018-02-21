import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { withStore } from '../../services/store'
import { capitalizeWords, snakeCase } from '../../utils/string'

type Props = {
  className?: string
  onChange(serviceArea: string | null): void
  value: string | null
}

const ALL_SERVICE_AREAS = 'All service areas'

export let ServiceAreaSelector = withStore('counties')<Props>(({ className, onChange, store, value }) => {
  let menuItems = chain(store.get('counties'))
    .map(_ => <MenuItem value={_} key={_} primaryText={capitalizeWords(_)} />)
    .value()
  menuItems.unshift(<MenuItem value={null} key={ALL_SERVICE_AREAS} primaryText={ALL_SERVICE_AREAS} />)
  return <DropDownMenu
    className={className ? className : undefined}
    onChange={(_event, _index, value) => onChange(value === null ? null : snakeCase(value))}
    value={value}>
    {menuItems}
  </DropDownMenu>
})

ServiceAreaSelector.displayName = 'ServiceAreaSelector'
