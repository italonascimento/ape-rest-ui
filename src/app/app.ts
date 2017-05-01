import {VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs from 'xstream'
import {Stream, MemoryStream} from 'xstream'
import {routes, Route} from './router'
import * as _ from 'lodash'
import {Sources, Sinks, Component} from './types'
import {GenericInput} from '@cycle/history'

export interface State {

}

export function App(sources: Sources): Partial<Sinks> {

  const history$ = sources.history
  const vdom$ = view(history$, sources)

  const sinks: Partial<Sinks> = {
    DOM: vdom$,
  }

  return sinks
}

function view(history: Stream<GenericInput>, sources: Partial<Sources>): Stream<VNode> {
  return history
    .map(currentPage)
    .map(page => page ? page(sources).DOM : null)
    .map(pageDOM =>
      div('.main-content', [
        pageDOM
      ])
    )
}

function currentPage(history: GenericInput): Component {
  const node = _.find(routes, (route: Route) => route.path === history.pathname)
  return node ? node.component : null
}
