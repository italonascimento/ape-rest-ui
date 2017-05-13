import {Triphasic, ViewMode} from 'app/types'
import {State as TypesListState} from './components/types-list/types-list.state'

export interface State {
  viewMode: ViewMode
  typesList: TypesListState
}
