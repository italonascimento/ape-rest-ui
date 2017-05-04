import {Sources, Sinks, Reducer} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div} from '@cycle/dom'
import xs from 'xstream'
import * as _ from 'lodash'
import {RequestInput} from '@cycle/http'

export interface State {
  types: any
}

interface Model {
  request$: Stream<RequestInput>
  reducer$: Stream<Reducer<State>>
}

interface GetTypesAction {
  type: 'GET_TYPES',
  payload?: any
}

export function TypesPage(sources: Partial<Sources>) {
  const state$ = sources.onion.state$
  const vdom$ = view(state$)

  const modelData: Model = model(intent(sources))

  const request$ = modelData.request$
  const reducer$ = modelData.reducer$

  return {
    DOM: vdom$,
    HTTP: request$,
    onion: reducer$
  }
}

function intent(sources: Partial<Sources>): any {
  return {
    getTypes$: xs.of(getTypesAction()),
    getTypesResult$: sources.HTTP
      .select('getTypes')
      .flatten()
  }
}

function model(actions: any): Model {
  const getTypesRequest$ = actions.getTypes$
    .mapTo({
      url: 'http://localhost:3001/admin/types',
      category: 'getTypes',
    })

  const initialReducer$: Stream<Reducer<State>> = xs.of(initialReducer())

  const getTypesReducer$: Stream<Reducer<State>> = actions.getTypesResult$
    .map(getTypesReducer)

    return {
      request$: getTypesRequest$,
      reducer$: xs.merge(initialReducer$, getTypesReducer$)
    }
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state =>
      div([
        'Types page',
        div([state.types])
      ])
    )
}

function getTypesAction(): GetTypesAction {
  return {
    type: 'GET_TYPES'
  }
}

function getTypesReducer(res: any): Reducer<State> {
  return (prevState) => _.assign({}, prevState, {
    types: res.data
  })
}

function initialReducer(): Reducer<State> {
  return (prev) => prev ? prev : {
    types: []
  }
}
