import {Sources, Reducer} from 'app/types'
import {DOMSource, VNode, div, form, label, p, button} from '@cycle/dom'
import {RequestInput} from '@cycle/http'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'
import Singleline from 'app/components/inputs/singleline'
import KeyValuePair from 'app/components/inputs/key-value-pair'
import isolate from '@cycle/isolate'
import {apply} from 'app/utils'
import {row, field, primaryButton, flatButton} from 'app/style/form'
import style from './type-form.style'
import {HistoryInput} from '@cycle/history'
import {TypesService} from 'app/api/service'
import responseHandler from 'app/api/utils/response-handler'
import {Functions as F} from 'app/utils'

interface Actions {
  postType: Stream<any>
  postTypeResponse: Stream<any>
  cancel: Stream<any>
}

interface Model {
  request: Stream<RequestInput>
  reducer: Stream<Reducer<State>>
  router: Stream<Partial<HistoryInput>>
}

export default function(sources: Partial<Sources>) {
  const {onion} = sources

  const {request, reducer, router} = model(intent(sources))

  const NameField = isolate(Singleline, 'typeName')({...sources, props: xs.of({placeholder: 'Name'})})
  const SlugField = isolate(Singleline, 'typeSlug')({...sources, props: xs.of({placeholder: 'Slug'})})
  const Field = isolate(KeyValuePair, 'field')(sources)
  console.log(Field)

  const vdom$ = xs.combine(
    onion.state$,
    NameField.DOM,
    SlugField.DOM,
    Field.DOM,
  ).map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      reducer,
      NameField.onion,
      SlugField.onion,
      Field.onion,
    ),
    HTTP: request,
    history: router
  }
}

function intent(sources: Partial<Sources>) {
  const {DOM, HTTP, onion} = sources

  return {
    postType: DOM
      .select('.form')
      .events('submit')
      .map(ev => {
        ev.preventDefault()

        return onion.state$.map(state => ({
          name: state.typeName,
          slug: state.typeSlug,
        }))
      })
      .flatten(),

    postTypeResponse: HTTP
      .select('postType')
      .map(responseHandler)
      .flatten()
      .filter(F.hasPath('data'))
      .map(res => res.data),

    cancel: DOM
      .select('.cancel')
      .events('click')
      .map(ev => {
        ev.preventDefault()
        return ev
      }),
  }
}

function model(actions: Actions): Model {
  return {
    request: xs.merge(
      actions.postType.map(TypesService.post),
    ),

    reducer: xs.merge(
      xs.of(TypeFormReducer.init()),
      actions.postTypeResponse.map(TypeFormReducer.postTypeResponse)
    ),

    router: actions.cancel.mapTo('/types')
  }
}

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
  Field: VNode,
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
          label({ attrs: { class: field }}, [
            Field,
          ])
        ]),

        div({ attrs: { class: `${row} right` }}, [
          button(`.cancel.${flatButton}`, [
            'Cancel'
          ]),

          button(`.${primaryButton}`, { attrs: { type: 'submit'}}, [
            'Save'
          ]),
        ]),
      ]),
    ])
  )
}
