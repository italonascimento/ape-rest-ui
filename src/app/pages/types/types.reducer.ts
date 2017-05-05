import {Reducer} from 'app/types'
import {State} from './types.state'
import {Type, ApiResponse} from 'app/service/models'
import * as _ from 'lodash'
import {Triphasic} from 'app/types'

export const typesReducer = {
  init(): Reducer<State> {
    return (prevState) => ({
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

  getTypesResult(types: Type[]): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: Triphasic.Done,
        data: types
      }
    })
  }
}
