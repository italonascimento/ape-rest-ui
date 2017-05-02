import {Sources, Sinks} from '../types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div} from '@cycle/dom'
import xs from 'xstream'

interface State {

}

export function TypesPage(sources: Partial<Sources>) {
  const state$ = sources.onion.state$
  const vdom$ = view(state$)

  const sinks: Partial<Sinks> = {
    DOM: vdom$
  }

  return sinks
}

function view(state: MemoryStream<State>): Stream<VNode> {
  return xs.of(
    div(['Types page'])
  )
}
