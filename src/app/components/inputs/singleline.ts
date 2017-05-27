import {Sources, Sinks, Reducer} from 'app/types'
import {VNode, input, DOMSource} from '@cycle/dom'
import xs, {Stream} from 'xstream'

export type State = string

interface Actions {
  input$: Stream<any>
}

interface Model {
  reducer$: Stream<Reducer<State>>
}

export default function(sources: Partial<Sources>): Partial<Sinks> {
  const {onion, DOM} = sources

  const vdom$ = onion.state$
    .map(view)

  const {reducer$} = model(intent(DOM))

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

function intent(DOM: DOMSource): Actions {
  return {
    input$: DOM.select('input')
      .events('input')
  }
}

function model(actions: Actions): Model {

  const initReducer$ = xs.of((prevState: State) => prevState ? prevState : '')

  const inputReducer$ = actions.input$
    .map(evt => evt.target.value)
    .map(value => (prevState: State) => value)

  return {
    reducer$: xs.merge(
      initReducer$,
      inputReducer$,
    )
  }
}

function view(state: State): VNode {
  return (
    input({
      props: {
        value: state
      }
    })
  )
}
