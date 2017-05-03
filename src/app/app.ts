import {VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs from 'xstream'
import {Stream, MemoryStream} from 'xstream'
import {HistoryInput, GenericInput} from '@cycle/history'
import {routes, Route} from 'app/router'
import * as _ from 'lodash'
import {Sources, Sinks, Component} from './types'
import {GenericInput} from '@cycle/history'

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
    .map(page => page(sources).DOM)
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

function currentPage(history: GenericInput): any {
  const node = _.find(routes, (route: Route) => route.path === history.pathname)
  return node ? node.component : null
}
