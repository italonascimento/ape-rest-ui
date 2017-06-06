import {Triphasic, ViewMode} from 'app/types'
import {State as TypesListState} from './types-list/types-list.state'
import {State as TypeFormState} from './type-form/type-form.state'

export interface State {
  viewMode: ViewMode
  typesList: TypesListState
  typeForm: TypeFormState
}
