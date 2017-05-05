import {Reducer} from 'app/types'
import {State} from './types.state'
import {Type, ApiResponse} from 'app/service/models'
import * as _ from 'lodash'

export const typesReducer = {
  init(): Reducer<State> {
    return (prevState) => ({
      types: []
    })
  },

  getTypes(res: any): Reducer<State> {
    const body: ApiResponse<Type> = res.body
    console.log(body)
    
    return (prevState) => _.assign({}, prevState, {
      types: body.data
    })
  }
}
