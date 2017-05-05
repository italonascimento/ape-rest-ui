import {Sources, Sinks, Reducer} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div, h1, h3, ul, li, p} from '@cycle/dom'
import xs from 'xstream'
import * as _ from 'lodash'
import {RequestInput} from '@cycle/http'
import {Type, ApiResponse} from 'app/service/models'
import {typesReducer} from './types.reducer'
import {State} from './types.state'

interface Model {
  request$: Stream<RequestInput>
  reducer$: Stream<Reducer<State>>
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
    getTypes$: xs.of(true),
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

  const initialReducer$: Stream<Reducer<State>> = xs.of(typesReducer.init())

  const getTypesReducer$: Stream<Reducer<State>> = actions.getTypesResult$
    .map(typesReducer.getTypes)

    return {
      request$: getTypesRequest$,
      reducer$: xs.merge(initialReducer$, getTypesReducer$)
    }
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state => state.types)
    .filter(Boolean)
    .map(types =>
      div('.types-page', [
        h1('.types-page_title', 'Types page'),

        types.length ?
        ul('.types-list',
          _.map(types, type =>
            li('test')
          )
        ) :
        div('.types-list.types-list--empty', [
          p('No types to show')
        ])
      ])
    )
}
