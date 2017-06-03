import {Triphasic} from 'app/types'

export interface ApiResponse<T> {
  type: string
  data: T
}

export interface Type {
  name: string
  slug: string
  attributes?: TypeAttribute[]
}

type FieldType = 'singleline' | 'multiline' | 'singlechoice' | 'multichoice'

export interface TypeAttribute {
  name: string
  slug: string
  fieldType: FieldType
}
