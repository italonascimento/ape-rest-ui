import {Sources as AppSources, Sinks, Reducer} from 'app/types'
import {VNode, input, DOMSource} from '@cycle/dom'
import xs, {Stream} from 'xstream'
import {apply} from 'app/utils'
import formClasses from 'app/style/form'

export type State = string

interface Actions {
  input: Stream<any>
}

interface Model {
  reducer: Stream<Reducer<State>>
}

export interface Props {
  placeholder: string
}

interface Sources extends AppSources {
  props: Stream<Props>
}

export default function(sources: Partial<Sources>): Partial<Sinks> {
  const {onion, DOM, props} = sources

  const vdom$ = xs.combine(
    onion.state$,
    props
  ).map(apply(view))

  const {reducer} = model(intent(DOM))

  return {
    DOM: vdom$,
    onion: reducer
  }
}

function intent(DOM: DOMSource): Actions {
  return {
    input: DOM.select('input')
      .events('input')
  }
}

function model(actions: Actions): Model {

  const initReducer$ = xs.of((prevState: State) => prevState ? prevState : '')

  const inputReducer$ = actions.input
    .map(evt => evt.target.value)
    .map(value => (prevState: State) => value)

  return {
    reducer: xs.merge(
      initReducer$,
      inputReducer$,
    )
  }
}

function view(state: State, props: Props): VNode {
  return (
    input(`.${formClasses.singleline}`, {
      attrs: {
        value: state,
        placeholder: props.placeholder,
      }
    })
  )
}
