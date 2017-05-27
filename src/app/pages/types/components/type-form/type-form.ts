import {Sources, Reducer} from 'app/types'
import {VNode, div, form, label, p} from '@cycle/dom'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'
import Singleline from 'app/components/inputs/singleline'
import isolate from '@cycle/isolate'
import {apply} from 'app/utils'

interface Actions {

}

interface Model {
  reducer$: Stream<Reducer<State>>
}

export default function(sources: Partial<Sources>) {
  const {onion, DOM, HTTP} = sources

  const {reducer$} = model(intent())

  const NameField = isolate(Singleline, 'typeName')(sources)

  const vdom$ = xs.combine(
    onion.state$,
    NameField.DOM)
    .map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      reducer$,
      NameField.onion,
    ),
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

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
): VNode {
  return (
    div('.new-type', [
      form('.form', [
        div('.form_row', [
          label('.form_field', [
            NameField,
          ])
        ])
      ])
    ])
  )
}
