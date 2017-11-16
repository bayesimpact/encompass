import { identity } from 'lodash'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import * as React from 'react'
import ReactAutocomplete = require('react-autocomplete')
import { fuzz } from '../../utils/string'
import './Autocomplete.css'

type Props = {
  defaultValue?: string
  items: string[]
  onChange(item: string): void
  pinnedItems?: string[]
  value: string | null
}

type State = {
  text?: string
}

let ItemTemplate = (pinnedItems: string[] = []) =>
  (item: string, isHighlighted: boolean) =>
    <span
      className={
        'Item'
        + (isHighlighted ? ' -isHighlighted' : '')
        + (pinnedItems.includes(item) ? ' -isPinned' : '')
      }
      key={item}
    >{item}</span>

let MenuTemplate = (items: string[]) =>
  <div children={items} className='Menu' />

/**
 * TODO: Find a more full-featured React autocomplete and use that instead
 * of rolling one ourselves.
 */
export class Autocomplete extends React.Component<Props> {
  state: State = {
    text: undefined
  }

  componentDidMount() {
    if (this.state.text === undefined && this.props.value !== null) {
      this.setState({ text: this.props.value })
    } else if (this.state.text === undefined && this.props.defaultValue !== null) {
      this.setState({ text: this.props.defaultValue })
    }
  }

  render() {
    return <span className='Autocomplete'>
      <Arrow />
      <ReactAutocomplete
        getItemValue={identity}
        items={(this.props.pinnedItems || []).concat(this.props.items)}
        renderItem={ItemTemplate(this.props.pinnedItems)}
        renderMenu={MenuTemplate}
        value={this.state.text}
        onChange={(e: any) => this.onType(e.target.value)}
        onSelect={(_: string, item: string) => this.onSelect(item)}
        selectOnBlur={true}
        shouldItemRender={this.shouldItemRender}
        wrapperStyle={{}}
      />
    </span>
  }

  /**
   * TODO: Benchmark - do we need a faster comparison here?
   */
  shouldItemRender = (item: string, value: string) =>

    // If the default value is selected, show all items
    (this.props.value === this.props.defaultValue)

    // Always show pinned items
    || (this.props.pinnedItems && this.props.pinnedItems.includes(item))

    // Otherwise, do a case-insensitive comparison
    || fuzz(item).includes(fuzz(value))

  onSelect(item: string) {
    this.setState({ text: item })
    this.props.onChange(item)
  }

  /**
   * Fire `onChange` if it's an exact (case-insensitive) match.
   *
   * TODO: Hash items for faster lookup
   */
  onType(text: string) {
    this.setState({ text })
    let match = this.props.items.find(_ => fuzz(_) === fuzz(text)) // TODO: Is this safe?
    if (match) {
      this.props.onChange(match)
    }
  }
}
