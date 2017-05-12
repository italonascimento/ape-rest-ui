import {Sources, Sinks, Reducer, Triphasic, ViewMode} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div, h1, h3, ul, li, p, a, span} from '@cycle/dom'
import xs from 'xstream'
import {RequestInput} from '@cycle/http'
import {Type, ApiResponse} from 'app/service/models'
import {TypesReducer} from './types.reducer'
import {apiService} from 'app/service/api-service'
import {State} from './types.state'
import {bodyParser} from 'app/service/utils/body-parser'
import {TypeForm} from './components/type-form'
import {TypesList} from './components/types-list'

interface Model {
  request: Stream<RequestInput>
  reducer: Stream<Reducer<State>>
}

interface Actions {
  getTypes: Stream<undefined>
  getTypesResponse: Stream<Type[]>
  newType: Stream<any>
}

export function TypesPage(sources: Partial<Sources>) {
  const state$ = sources.onion.state$
  const vdom$ = view(state$)

  const modelData: Model = model(intent(sources))
  const request$ = modelData.request
  const reducer$ = modelData.reducer

  return {
    DOM: vdom$,
    HTTP: request$,
    onion: reducer$
  }
}

function intent(sources: Partial<Sources>): Actions {
  const {HTTP, DOM} = sources

  return {
    getTypes: xs.of(undefined),

    getTypesResponse: HTTP
      .select('getTypes')
      .flatten()
      .map(bodyParser),

    newType: DOM
      .select('.new-type')
      .events('click')
  }
}

function model(actions: Actions): Model {
  const getTypesRequest$ = actions.getTypes
    .mapTo(apiService.getTypes)

  const initialReducer$: Stream<Reducer<State>> = xs.of(TypesReducer.init())

  const getTypesReducer$: Stream<Reducer<State>> = actions.getTypes
    .mapTo(TypesReducer.getTypes())

  const getTypesResponseReducer$: Stream<Reducer<State>> = actions.getTypesResponse
    .map(TypesReducer.getTypesResponse)

  const newTypeReducer$: Stream<Reducer<State>> = actions.newType
    .mapTo(TypesReducer.newType())

    return {
      request: getTypesRequest$,
      reducer: xs.merge(initialReducer$, getTypesReducer$, getTypesResponseReducer$, newTypeReducer$)
    }
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state =>
      div('.page.types-page',
      [
        h1('.page_title', 'Types'),

        ul('.toolbar', [
          li('.toolbar_option', [
            a('.new-type.toolbar_button', {attrs: {href: ''}}, 'New type')
          ])
        ]),

        CurrentView(state)
      ])
    )
}

function CurrentView(state: State): VNode {
  switch(state.viewMode){
    case ViewMode.List:
    const {data, pending} = state.types
    return TypesList(data, pending)

    case ViewMode.Edit:
    return TypeForm()
  }
}
