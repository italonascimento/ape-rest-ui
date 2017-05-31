import {Type} from 'app/api/models'
import {ApiRequest} from 'app/types'

export interface State {
  typeName: string
  type: ApiRequest<Type>
}
