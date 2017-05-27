import xs, {Stream} from 'xstream'
import * as _ from 'lodash'
import errorHandler from './error-handler'

export default function(res$: Stream<any>): Stream<any> {
  return res$.replaceError(errorHandler)
    .map((obj: any) => {
      if(_.has(obj, 'body')){
        return obj.body
      }

      return obj
    })
}
