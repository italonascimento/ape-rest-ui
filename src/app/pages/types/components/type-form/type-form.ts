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
import {TypesService} from 'app/api/service'

interface Actions {
  submit: Stream<any>
  cancel: Stream<any>
}

interface Model {
  request: Stream<RequestInput>
  reducer: Stream<Reducer<State>>
  router: Stream<Partial<HistoryInput>>
}

export default function(sources: Partial<Sources>) {
  const {onion, DOM, HTTP} = sources

  const {request, reducer, router} = model(intent(DOM))

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
    HTTP: request,
    history: router
  }
}

function intent(DOM: DOMSource) {
  return {
    submit: DOM.select('.form')
      .events('submit')
      .map(ev => {
        ev.preventDefault();
        return ev;
      }),

    cancel: DOM.select('.cancel')
      .events('click')
      .map(ev => {
        ev.preventDefault();
        return ev;
      }),
  }
}

function model(actions: Actions): Model {
  const submitRequest$ = actions.submit
    .mapTo(TypesService.post({name: 'test', slug: 'test'}))

  const initialReducer$: Stream<Reducer<State>> = xs.of(TypeFormReducer.init())

  return {
    request: submitRequest$,

    reducer: xs.merge(
      initialReducer$
    ),

    router: actions.cancel.mapTo('/types')
  }
}

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
): VNode {
  return (
    div([
      form(`.form.${style.form}`, [
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
          button(`.${primaryButton}`, { attrs: { type: 'submit'}}, [
            'Save'
          ]),

          button(`.cancel.${flatButton}`, [
            'Cancel'
          ]),
        ]),
      ]),
    ])
  )
}
