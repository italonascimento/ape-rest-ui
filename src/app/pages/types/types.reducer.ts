import {Reducer} from 'app/types'
import {State} from './types.state'
import {Type, ApiResponse} from 'app/service/models'
import * as _ from 'lodash'
import {Triphasic} from 'app/types'
import {GetTypesResponseAction} from './types.actions'

export const TypesReducer = {
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

  getTypesResponse(action: GetTypesResponseAction): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: Triphasic.Done,
        data: action.payload
      }
    })
  }
}
