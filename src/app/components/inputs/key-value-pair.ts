import {Sources as AppSources, Reducer} from 'app/types'
import {apply} from 'app/utils'
import xs, {Stream} from 'xstream'
import {div, input, VNode, DOMSource} from '@cycle/dom'
import * as _ from 'lodash'
import Singleline from './singleline'
import isolate from '@cycle/isolate'
import {keyValuePair} from 'app/style/form'

export interface State {
  key: string
  value: string
}

export interface Props {
  placeholders: string[]
}

interface Sources extends AppSources {
  props: Stream<Props>
}

interface Actions {
  inputKey: Stream<any>
  inputValue: Stream<any>
}

interface Model {
  reducer: Stream<Reducer<State>>
}


export default function(sources: Partial<Sources>) {
  const {DOM, onion, props} = sources

  const placeholders: Stream<string[]> = props.map(p =>
    p.placeholders && p.placeholders.length ?
    p.placeholders :
    ['Key', 'Value']
  )

  const key = isolate(Singleline, 'key')({
    ...sources,
    props: placeholders.map(placeholders => ({
      placeholder: placeholders[0]
    }))
  })

  const value = isolate(Singleline, 'value')({
    ...sources,
    props: placeholders.map(placeholders => ({
      placeholder: _.get(placeholders, '1', placeholders[0])
    }))
  })

  const vdom$ = xs.combine(
    key.DOM,
    value.DOM,
  ).map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      key.onion,
      value.onion,
    )
  }
}

function view(key: VNode, value: VNode): VNode {
  return (
    div(`.${keyValuePair}`, [
      key,
      value,
    ])
  )
}
