import {Type, TypeAttribute} from 'app/api/models'
import {ApiRequest} from 'app/types'

export interface State {
  name: string
  slug: string
  attributes: TypeAttribute[]
  type: ApiRequest<Type>
}
