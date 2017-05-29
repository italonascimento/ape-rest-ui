import {Sources, Reducer} from 'app/types'
import {DOMSource, VNode, div, form, label, p, button} from '@cycle/dom'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'
import Singleline from 'app/components/inputs/singleline'
import isolate from '@cycle/isolate'
import {apply} from 'app/utils'
import {row, field, primaryButton, flatButton} from 'app/style/form'
import style from './type-form.style'
import {HistoryInput} from '@cycle/history'

interface Actions {
  cancel: Stream<any>
}

interface Model {
  reducer: Stream<Reducer<State>>
  router: Stream<Partial<HistoryInput>>
}

export default function(sources: Partial<Sources>) {
  const {onion, DOM, HTTP} = sources

  const {reducer, router} = model(intent(DOM))

  const NameField = isolate(Singleline, 'typeName')({...sources, props: xs.of({placeholder: 'Name'})})
  const SlugField = isolate(Singleline, 'typeSlug')({...sources, props: xs.of({placeholder: 'Slug'})})

  const vdom$ = xs.combine(
    onion.state$,
    NameField.DOM,
    SlugField.DOM)
    .map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      reducer,
      NameField.onion,
      SlugField.onion,
    ),
    HTTP: xs.never(),
    history: router
  }
}

function intent(DOM: DOMSource) {
  return {
    cancel: DOM.select('.cancel')
      .events('click')
  }
}

function model(actions: Actions): Model {
  const initialReducer$: Stream<Reducer<State>> = xs.of(TypeFormReducer.init())

  return {
    reducer: xs.merge(
      initialReducer$
    ),

    router: actions.cancel.mapTo({pathname: '/types'})
  }
}

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
): VNode {
  return (
    div([
      form({ attrs: { class: style.form }}, [
        div({ attrs: { class: row }}, [
          label({ attrs: { class: field }}, [
            NameField,
          ]),
        ]),

        div({ attrs: { class: row }}, [
          label({ attrs: { class: field }}, [
            SlugField,
          ])
        ]),

        div({ attrs: { class: row }}, [
          button({ attrs: { class: primaryButton }}, [
            'Save'
          ]),

          button('.cancel', { attrs: { class: flatButton }}, [
            'Cancel'
          ]),
        ])
      ]),
    ])
  )
}
