import {Sources, Reducer, Triphasic} from 'app/types'
import {DOMSource, VNode, div, ul, li, p} from '@cycle/dom'
import {HTTPSource, RequestInput} from '@cycle/http'
import xs, {Stream} from 'xstream'
import {Type} from 'app/service/models'
import {State} from './types-list.state'
import TypesListReducer from './types-list.reducer'
import responseHandler from 'app/service/utils/response-handler'
import {apiService} from 'app/service/api-service'
import * as _ from 'lodash'
import {Functions as F} from 'app/utils'

interface Model {
  request$: Stream<RequestInput>
  reducer$: Stream<Reducer<State>>
}

interface Actions {
  getTypes$: Stream<undefined>
  getTypesResponse$: Stream<Type[]>
}

export default function(sources: Partial<Sources>){
  const {onion, HTTP, DOM} = sources
  const vdom$ = onion.state$
    .map(view)

  const {request$, reducer$} = model(intent(DOM, HTTP))

  return {
    DOM: vdom$,
    HTTP: request$,
    onion: reducer$
  }
}

function intent(DOM: DOMSource, HTTP: HTTPSource): Actions {
  return {
    getTypes$: xs.of(undefined),

    getTypesResponse$: HTTP
      .select('getTypes')
      .map(responseHandler)
      .flatten()
      .filter(F.hasPath('data'))
      .map(res => res.data),
  }
}

function model(actions: Actions): Model {
  const getTypesRequest$ = actions.getTypes$
  .mapTo(apiService.getTypes)

  const initialReducer$: Stream<Reducer<State>> = xs.of(TypesListReducer.init())

  const getTypesReducer$: Stream<Reducer<State>> = actions.getTypes$
    .mapTo(TypesListReducer.getTypes())

  const getTypesResponseReducer$: Stream<Reducer<State>> = actions.getTypesResponse$
    .map(TypesListReducer.getTypesResponse)

  return {
    request$: getTypesRequest$,
    reducer$: xs.merge(initialReducer$, getTypesReducer$, getTypesResponseReducer$)
  }
}

function view(state: State): VNode {
  if(state.types.data.length === 0){
    return (
      div('.types-list.types-list--empty', [
        p('No types to show')
      ])
    )
  }

  return (
    ul('.types-list', {
      class: {'types-list--pending': state.types.pending}
    },
      _.map(state.types.data, Type)
    )
  )
}

function Type(data: Type): VNode {
  return (
    li('.type', data.name)
  )
}
