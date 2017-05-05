export interface ApiResponse<T> {
  type: string
  data: T
}

export interface Type {
  name: string
  slug: string
}
