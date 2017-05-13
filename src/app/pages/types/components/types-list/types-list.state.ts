import {Type, ApiRequest} from 'app/service/models'

export interface State {
  types: ApiRequest<Type[]>
}
