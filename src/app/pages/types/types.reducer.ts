import {Reducer, ViewMode} from 'app/types'
import {State} from './types.state'
import {Type, ApiResponse} from 'app/service/models'
import * as _ from 'lodash'
import {Triphasic} from 'app/types'

export const TypesReducer = {
  init(): Reducer<State> {
    return (prevState) => prevState ? prevState : ({
      viewMode: ViewMode.List,
      types: {
        pending: Triphasic.Initial,
        data: []
      }
    })
  },

  getTypes(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: Triphasic.Pending,
        data: prevState.types.data
      }
    })
  },

  getTypesResponse(types: Type[]): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: Triphasic.Done,
        data: types
      }
    })
  },

  newType(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      viewMode: ViewMode.Edit
    })
  },
}
