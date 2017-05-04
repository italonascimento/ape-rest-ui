import {VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs from 'xstream'
import {Stream, MemoryStream} from 'xstream'
import {HistoryInput, GenericInput} from '@cycle/history'
import {routes, Route} from 'app/router'
import * as _ from 'lodash'
import {Sources, Sinks, ViewComponent, Reducer} from 'app/types'
import {State as TypesPageState} from 'app/pages/types.page'

export interface State {
  typesPage: TypesPageState
}

interface Model {
  DOM$: Stream<VNode>
  reducer$: Stream<Reducer<Partial<State>>>
}

export function App(sources: Sources): Partial<Sinks> {
  const modelData = model(sources)

  const vdom$ = view(modelData.DOM$)

  return {
    DOM: vdom$,
    onion: modelData.reducer$
  }
}

function model(sources: Partial<Sources>): Model{
  const currentPage$ = sources.history
    .map(currentPage)

  return {
    DOM$: currentPage$
      .map(page => page(sources).DOM)
      .flatten(),

    reducer$: currentPage$
      .map(page => page(sources).onion)
      .flatten()
  }
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
  return node.view
}
