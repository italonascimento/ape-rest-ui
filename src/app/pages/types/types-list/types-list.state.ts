import {ApiRequest} from 'app/types'
import {Type} from 'app/api/models'

export interface State {
  types: ApiRequest<Type[]>
}
