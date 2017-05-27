import {Sources, Sinks, Reducer, ViewMode, ViewComponent} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {DOMSource, VNode, div, h1, h3, ul, li, p, a, span} from '@cycle/dom'
import xs from 'xstream'
import TypesReducer from './types.reducer'
import {State} from './types.state'
import {RequestInput} from '@cycle/http'
import isolate from '@cycle/isolate'
import TypesListComponent from './components/types-list/types-list'
import TypeFormComponent from './components/type-form/type-form'
import {GenericInput} from '@cycle/history'
import {routes, Route} from 'app/router'
import * as _ from 'lodash'
import {apply} from 'app/utils'

interface Model {
  reducer$: Stream<Reducer<State>>
}

interface Actions {
  changeMode$: Stream<any>
  newType$: Stream<any>
}


export default function (sources: Partial<Sources>) {
  const {onion, DOM, history} = sources

  const {reducer$} = model(intent(sources))

  const CurrentMode$ = history
    .map(currentMode)
    .map(component => component(sources))

  const vdom$ = xs.combine(
    onion.state$,
    CurrentMode$
      .map(m => m.DOM)
      .flatten())
    .map(apply(view))

  return {
    DOM: vdom$,
    HTTP: xs.merge(
      CurrentMode$
        .map(m => m.HTTP)
        .flatten(),
    ),
    onion: xs.merge(
      reducer$,
      CurrentMode$
        .map(m => m.onion)
        .flatten(),
    )
  }
}

function intent(sources: Partial<Sources>): Actions {
  const {DOM, history} = sources

  return {
    changeMode$: history
      .map((h: GenericInput) => _.split(h.pathname, '/')[2] || ''),

    newType$: DOM
      .select('.new-type')
      .events('click')
  }
}

function model(actions: Actions): Model {
  const changeModeReducer$: Stream<Reducer<State>> = actions.changeMode$
    .map(TypesReducer.changeMode)

  const resetNewTypeReducer$: Stream<Reducer<State>> = actions.newType$
    .mapTo(TypesReducer.resetNewType())

  return {
    reducer$: xs.merge(
      changeModeReducer$,
      resetNewTypeReducer$,
    )
  }
}

function view(state: State, CurrentMode: VNode): VNode {
  return (
    div('.page.types-page',
    [
      h1('.page_title', 'Types'),

      ul('.toolbar', [
        state.viewMode === ViewMode.List ?
        li('.toolbar_item', [
          a('.button.new-type', {props: {href: '/types/new'}}, 'New type')
        ]) :
        null,

        state.viewMode === ViewMode.Edit ?
        li('.toolbar_item', [
          a('.button.cancel', {props: {href: '/types'}}, 'Cancel')
        ]) :
        null
      ]),

      CurrentMode,
    ])
  )
}

function currentMode(history: GenericInput): ViewComponent {
  const paths = _.split(history.pathname, '/')
  const currentRoute = _.find(routes, (route: Route) => _.includes(paths, route.path))
  const node = _.find(currentRoute.children, (route: Route) => paths[2] === route.path)

  return node ? node.view : (
    _.find(currentRoute.children, (route: Route) => route.path === "").view || null
  )
}
