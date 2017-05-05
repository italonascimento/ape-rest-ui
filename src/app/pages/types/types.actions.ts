import {Type} from 'app/service/models'
import {Stream} from 'xstream'

export interface GetTypesAction {
  name: 'GET_TYPES'
}

export interface GetTypesResponseAction {
  name: 'GET_TYPES_RESPONSE',
  payload: Type[]
}

export const ActionCreator = {
  getTypes(): GetTypesAction {
    return {
      name: 'GET_TYPES'
    }
  },

  getTypesResponse(types: Type[]): GetTypesResponseAction {
    return {
      name: 'GET_TYPES_RESPONSE',
      payload: types
    }
  }
}
