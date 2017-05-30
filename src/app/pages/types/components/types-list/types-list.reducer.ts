import * as _ from 'lodash'
import {Triphasic} from 'app/types'
import {Type, ApiResponse} from 'app/api/models'
import {State} from './types-list.state'
import {Reducer} from 'app/types'

export default {
  init(): Reducer<State> {
    return (prevState) => prevState ? prevState : _.assign({}, prevState, {
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
}
