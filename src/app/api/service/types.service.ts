import baseUrl from 'app/api/base-url'
import {Type} from 'app/api/models'

export default {
  get: () => ({
    url: `${baseUrl}/types`,
    category: 'getTypes',
  }),

  post: (type: Type) => ({
    url: `${baseUrl}/types`,
    method: 'POST',
    category: 'postTypes',
    send: type
  })
}
