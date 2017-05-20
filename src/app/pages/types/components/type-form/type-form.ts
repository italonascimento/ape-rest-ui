import {Sources, Reducer} from 'app/types'
import {VNode, div, form, label} from '@cycle/dom'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'

interface Actions {

}

interface Model {
  reducer$: Stream<Reducer<State>>
}

export default function(sources: Partial<Sources>) {
  const {onion, DOM, HTTP} = sources

  const {reducer$} = model(intent())

  const vdom$ = onion.state$
    .map(view)

  return {
    DOM: vdom$,
    onion: reducer$,
    HTTP: xs.never(),
  }
}

function intent(): Actions {
  return {

  }
}

function model(actions: Actions): Model {
  const initialReducer$: Stream<Reducer<State>> = xs.of(TypeFormReducer.init())

  return {
    reducer$: xs.merge(
      initialReducer$
    )
  }
}

function view(state: State): VNode {
  return (
    div('.new-type', 'New type')
  )
}
