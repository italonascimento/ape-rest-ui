import {Sources, Sinks, Reducer, Triphasic} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {VNode, div, h1, h3, ul, li, p} from '@cycle/dom'
import xs from 'xstream'
import * as _ from 'lodash'
import {RequestInput} from '@cycle/http'
import {Type, ApiResponse} from 'app/service/models'
import {typesReducer} from './types.reducer'
import {apiService} from 'app/service/api-service'
import {State} from './types.state'
import {bodyParser} from 'app/service/utils/body-parser'

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
      .map(bodyParser)
  }
}

function model(actions: any): Model {
  const getTypesRequest$ = actions.getTypes$
    .mapTo(apiService.getTypes)

  const initialReducer$: Stream<Reducer<State>> = xs.of(typesReducer.init())

  const getTypesReducer$: Stream<Reducer<State>> = actions.getTypes$
    .map(typesReducer.getTypes)

  const getTypesResultReducer$: Stream<Reducer<State>> = actions.getTypesResult$
    .map(typesReducer.getTypesResult)

    return {
      request$: getTypesRequest$,
      reducer$: xs.merge(initialReducer$, getTypesReducer$, getTypesResultReducer$)
    }
}

function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state => state.types)
    .filter(Boolean)
    .map(types =>
      div('.types-page',
      [
        h1('.types-page_title', 'Types'),

        div('.types',
        {
          class: {'types--loading': types.pending === Triphasic.Pending},
        },
        [
          types.data.length ?
          ul('.types_list',
            _.map(types.data, type =>
              li('test')
            )
          ) :
          div('.types_empty-list', [
            p('No types to show')
          ])
        ])
      ])
    )
}
