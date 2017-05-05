import {Type} from 'app/service/models'
import {Triphasic} from 'app/types'

export interface State {
  types: {
    pending: Triphasic
    data: Type[]
  }
}
