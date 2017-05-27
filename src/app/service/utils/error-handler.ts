import xs, {Stream} from 'xstream'

export default function(err: any) {
  return xs.of({
    code: 9999,
    message: 'An error has ocurred'
  })
}
