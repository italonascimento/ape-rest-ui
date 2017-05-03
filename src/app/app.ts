import {VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs from 'xstream'
import {Stream, MemoryStream} from 'xstream'
import {HistoryInput, GenericInput} from '@cycle/history'
import {routes, Route} from 'app/router'
import * as _ from 'lodash'
import {Sources, Sinks, ViewComponent} from './types'

export interface State {

}

export function App(sources: Sources): Partial<Sinks> {
  const vdom$ = view(model(sources))

  return {
    DOM: vdom$,
  }
}

function model(sources: Partial<Sources>): Stream<VNode>{
  return sources.history
    .map(currentPage)
    .map(page => page ? page(sources).DOM : null)
    .flatten()
}

function view(currentPageDOM: Stream<VNode>): Stream<VNode> {
  return currentPageDOM
    .map(pageDOM =>
      div('.main-content', [
        pageDOM
      ]
    )
  )
}

function currentPage(history: GenericInput): ViewComponent {
  const node = _.find(routes, (route: Route) => route.path === history.pathname)
  return node ? node.view : null
}
