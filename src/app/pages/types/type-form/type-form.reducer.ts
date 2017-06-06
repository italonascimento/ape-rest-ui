import * as _ from 'lodash'
import {Triphasic} from 'app/types'
import {Type, ApiResponse, TypeAttribute} from 'app/api/models'
import {State} from './type-form.state'
import {Reducer} from 'app/types'

export default {
  init(): Reducer<State> {
    return (prevState) => <State>{
      name: '',
      slug: '',
      attributes: [],
      type: {
        pending: Triphasic.Initial,
        data: null
      }
    }
  },

  postType(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      type: {
        pending: Triphasic.Pending,
        data: prevState.type.data
      }
    })
  },

  postTypeResponse(type: Type): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      type: {
        pending: Triphasic.Done,
        data: type
      }
    })
  },

  addAttribute(): Reducer<State> {
    return (prevState) => _.assign({}, prevState, {
      attributes: _.concat(prevState.attributes || [], <TypeAttribute>{})
    })
  }
}
