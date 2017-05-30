import {Type, ApiRequest} from 'app/api/models'

export interface State {
  types: ApiRequest<Type[]>
}
