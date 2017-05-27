export default function<T>(func: Function) {
  return (args: T) =>  func.apply(null, args)
}
