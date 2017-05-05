import {Reducer} from 'app/types'
import {State} from './types.state'
import {Type, ApiResponse} from 'app/service/models'
import * as _ from 'lodash'

export const typesReducer = {
  init(): Reducer<State> {
    return (prevState) => ({
      types: {
        pending: false,
        data: [{name: 'test', slug: 'test'}]
      }
    })
  },

  getTypes(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: true,
        data: prevState.types.data
      }
    })
  },

  getTypesResult(types: Type[]): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      types: {
        pending: false,
        data: types
      }
    })
  }
}
