import {DOMSource, VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import {Stream, MemoryStream} from 'xstream'
import {Sources, Sinks, Reducer} from '../types'

export interface State{

}

export function TypesPage(sources: Sources): Partial<Sinks>{
  const state$ = sources.onion.state$

  const vdom$ = view(state$)

  const sinks: Partial<Sinks> = {
    DOM: vdom$,
    // onion: reducer$,
  }

  return sinks
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$.map(state => (
    div(['Types page'])
  ))
}
