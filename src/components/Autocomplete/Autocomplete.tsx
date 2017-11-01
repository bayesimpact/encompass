import { identity } from 'lodash'
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down'
import * as React from 'react'
import ReactAutocomplete = require('react-autocomplete')
import './Autocomplete.css'

type Props = {
  items: string[]
  onChange(item: string): void
  value: string
}

type State = {
  text: string
}

let ItemTemplate = (item: string, isHighlighted: boolean) =>
  <span
    className={'Item' + (isHighlighted ? ' -isHighlighted' : '')}
    key={item}
  >{item}</span>

let MenuTemplate = (items: string[], value: string) =>
  <div children={items} className='Menu' />

export class Autocomplete extends React.Component<Props> {
  state: State = {
    text: ''
  }

  render() {

    let { onChange, value } = this.props

    return <span className='Autocomplete'>
      <Arrow />
      <ReactAutocomplete
        getItemValue={identity}
        items={this.props.items}
        renderItem={ItemTemplate}
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
  shouldItemRender(item: string, value: string) {
    return item.toLowerCase().includes(value.toLowerCase())
  }

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
    let match = this.props.items.find(_ => _.toLowerCase() === text.toLowerCase())
    if (match) {
      this.props.onChange(match)
    }
  }
}
