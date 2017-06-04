import {Sources, Reducer} from 'app/types'
import {DOMSource, VNode, div, form, label, p, button, i} from '@cycle/dom'
import {RequestInput} from '@cycle/http'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'
import Singleline from 'app/components/inputs/singleline'
import KeyValuePair from 'app/components/inputs/key-value-pair'
import isolate from '@cycle/isolate'
import {apply} from 'app/utils'
import {form as formClass, primaryButton, flatButton} from 'app/style/form'
import css from 'app/style'
import style from './type-form.style'
import {HistoryInput} from '@cycle/history'
import {TypesService} from 'app/api/service'
import responseHandler from 'app/api/utils/response-handler'
import {Functions as F} from 'app/utils'
import * as _ from 'lodash'
import {icon} from 'app/components'

interface Actions {
  postType: Stream<any>
  postTypeResponse: Stream<any>
  cancel: Stream<any>
  addAttribute: Stream<any>
}

interface Model {
  request: Stream<RequestInput>
  reducer: Stream<Reducer<State>>
  router: Stream<Partial<HistoryInput>>
}

export default function(sources: Partial<Sources>) {
  const {onion} = sources

  const {request, reducer, router} = model(intent(sources))

  const NameField = isolate(Singleline, 'name')({...sources, props: xs.of({placeholder: 'Name'})})
  const SlugField = isolate(Singleline, 'slug')({...sources, props: xs.of({placeholder: 'Slug'})})
  const AttributeField = isolate(KeyValuePair, 'field')(sources)

  const vdom$ = xs.combine(
    onion.state$,
    NameField.DOM,
    SlugField.DOM,
    AttributeField.DOM,
  ).map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      reducer,
      NameField.onion,
      SlugField.onion,
      AttributeField.onion,
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
          name: state.name,
          slug: state.slug,
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

    addAttribute: DOM
      .select('.add-attr')
      .events('click')
      .map(ev => {
        ev.preventDefault();
        (<any>ev.target).blur()
        return ev
      })
  }
}

function model(actions: Actions): Model {
  return {
    request: xs.merge(
      actions.postType.map(TypesService.post),
    ),

    reducer: xs.merge(
      xs.of(TypeFormReducer.init()),
      actions.postTypeResponse.map(TypeFormReducer.postTypeResponse),
      actions.addAttribute.mapTo(TypeFormReducer.addAttribute())
    ),

    router: actions.cancel.mapTo('/types')
  }
}

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
  AttributeField: VNode,
): VNode {
  return (
    div([
      form(`.form.${css(formClass, style.form)}`, [
        div(`.row`, [
          label('.field', [
            NameField,
          ]),
        ]),

        div(`.row`, [
          label('.field', [
            SlugField,
          ])
        ]),

        div(
          _.map(state.attributes, attr =>
            div(`.row.removable`, { style: style.expandRowTransition }, [
              label('.field', [
                AttributeField,
              ]),

              button('.remove-row', [
                icon('cross')
              ])
            ]),
          ),
        ),

        div(`.row`, [
          button(`.add-attr.${style.addAttribute}`, 'Add attribute')
        ]),

        div(`.row.right`, [
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
