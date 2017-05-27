import * as _ from 'lodash'

export default {
  hasPath: <T>(path: string) => (obj: T) => _.has(obj, path)
}
