import { chain } from 'lodash'
import { DropDownMenu } from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import * as React from 'react'
import { withStore } from '../../services/store'
import { capitalizeWords, snakeCase } from '../../utils/string'

type Props = {
  className?: string
  onChange(values: string[] | null): void
  values: string[] | null
}

const styles = {
  customWidth: {
    width: 200
  }
}

export let ServiceAreaSelector = withStore<Props>(({ className, onChange, store, values }) => {
  let menuItems = chain(store.get('counties'))
    .map(_ => <MenuItem value={_} key={_} primaryText={capitalizeWords(_)} />)
    .value()
  return <DropDownMenu
    className={className ? className : undefined}
    multiple={true}
    onChange={(_event, _index, value) => onChange(value.map((_: string) => snakeCase(_)))}
    value={values}
    maxHeight={200}
    style={styles.customWidth}
    autoWidth={false}
>
    {menuItems}
  </DropDownMenu>
})

ServiceAreaSelector.displayName = 'ServiceAreaSelector'
