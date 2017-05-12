import {Type} from 'app/service/models'
import {Triphasic, ViewMode} from 'app/types'

export interface State {
  viewMode: ViewMode
  types: {
    pending: Triphasic
    data: Type[]
  }
}
