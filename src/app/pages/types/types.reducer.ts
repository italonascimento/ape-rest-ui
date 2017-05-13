import {Reducer, ViewMode} from 'app/types'
import {State} from './types.state'
import * as _ from 'lodash'
import {Triphasic} from 'app/types'

export default {
  init(): Reducer<State> {
    return (prevState) => prevState ? prevState : _.assign({}, prevState, {
      viewMode: ViewMode.List
    })
  },

  newType(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      viewMode: ViewMode.Edit
    })
  },
}
