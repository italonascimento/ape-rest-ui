import {Reducer, ViewMode} from 'app/types'
import {State} from './types.state'
import * as _ from 'lodash'
import {Triphasic} from 'app/types'
import {State as TypeFormState} from './type-form/type-form.state'

export default {
  init(): Reducer<State> {
    return (prevState) => prevState ? prevState : <State>{
      viewMode: ViewMode.List
    }
  },

  changeMode(path: string): Reducer<State> {
    const getMode = (path: string) => {
      switch(path) {
        case 'new' || 'edit':
        return ViewMode.Edit

        default:
        return ViewMode.List
      }
    }
    return (prevState) => _.assign({}, prevState, {
      viewMode: getMode(path)
    })
  },
}
