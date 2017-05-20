import {VNode, p, div} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import xs from 'xstream'
import {Stream, MemoryStream} from 'xstream'
import {HistoryInput, GenericInput} from '@cycle/history'
import {routes, Route} from 'app/router'
import * as _ from 'lodash'
import {Sources, Sinks, ViewComponent, Reducer} from 'app/types'
import {State as TypesPageState} from 'app/pages/types/types.state'
import {RequestInput} from '@cycle/http'

export interface State {
  typesPage: TypesPageState
}

interface Model {
  DOM$: Stream<VNode>
  reducer$: Stream<Reducer<Partial<State>>>
  request$: Stream<RequestInput>
}

export function App(sources: Sources): Partial<Sinks> {
  const modelData = model(sources)

  const vdom$ = view(modelData.DOM$)

  return {
    DOM: vdom$,
    onion: modelData.reducer$,
    HTTP: modelData.request$
  }
}

function model(sources: Partial<Sources>): Model{
  const currentPage$ = sources.history
    .map(currentPage)
    .map(page => page(sources))

  return {
    DOM$: currentPage$
      .map(page => page.DOM)
      .flatten(),

    reducer$: currentPage$
      .map(page => page.onion)
      .flatten(),

    request$: currentPage$
      .map(page => page.HTTP)
      .flatten(),
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
  const paths = _.split(history.pathname, '/')
  const node = _.find(routes, (route: Route) => _.includes(paths, route.path))

  return node ? node.view : (
    _.find(routes, (route: Route) => route.path === "").view || null
  )
}
