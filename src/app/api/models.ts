import {Triphasic} from 'app/types'

export interface ApiResponse<T> {
  type: string
  data: T
}

export interface Type {
  name: string
  slug: string
}
