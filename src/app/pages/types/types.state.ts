import {Type} from 'app/service/models'

export interface State {
  types: {
    pending: boolean
    data: Type[]
  }
}
