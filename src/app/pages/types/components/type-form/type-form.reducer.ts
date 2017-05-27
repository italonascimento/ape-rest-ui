import * as _ from 'lodash'
import {Triphasic} from 'app/types'
import {Type, ApiResponse} from 'app/service/models'
import {State} from './type-form.state'
import {Reducer} from 'app/types'

export default {
  init(): Reducer<State> {
    return (prevState) => prevState ? prevState : {
      typeName: ''
    }
  },
}
