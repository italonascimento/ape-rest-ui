import {Sources, Sinks, Reducer} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div} from '@cycle/dom'
import xs from 'xstream'
import * as _ from 'lodash'
import {RequestInput} from '@cycle/http'

interface State {

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
      url: 'http://localhost:3000/types',
      category: 'getTypes',
    })

  const getTypesReducer$ = actions.getTypesResult$
    .map(getTypesReducer)

    return {
      request$: getTypesRequest$,
      reducer$: getTypesReducer$
    }
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return xs.of(
    div(['Types page'])
  )
}

function getTypesAction(): GetTypesAction {
  return {
    type: 'GET_TYPES'
  }
}

function getTypesReducer(res: any): Reducer<State> {
  return (prevState) => _.assign({}, prevState, {
    typesResult: res
  })
}
