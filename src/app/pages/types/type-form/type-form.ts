import {Sources, Reducer} from 'app/types'
import {
  DOMSource, VNode, div,
  form, label, p, h3,
  button, i, fieldset,
} from '@cycle/dom'
import {RequestInput} from '@cycle/http'
import {State} from './type-form.state'
import xs, {Stream} from 'xstream'
import TypeFormReducer from './type-form.reducer'
import {Singleline} from 'app/components/inputs'
import isolate from '@cycle/isolate'
import {apply} from 'app/utils'
import formClasses from 'app/style/form'
import css from 'app/style'
import classes from './type-form.style'
import {HistoryInput} from '@cycle/history'
import {TypesService} from 'app/api/service'
import responseHandler from 'app/api/utils/response-handler'
import {Functions as F} from 'app/utils'
import * as _ from 'lodash'
import {icon} from 'app/components'
import {TypeAttribute} from 'app/api/models'
import {pick, mix} from 'cycle-onionify'
import AttributeField from './attribute-field/attribute-field'

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

  const SlugField = isolate(Singleline, 'slug')({...sources, props: xs.of({placeholder: 'Slug'})})
  const NameField = isolate(Singleline, 'name')({...sources, props: xs.of({placeholder: 'Name'})})

  const attributesSinks$ = onion.state$.map(state =>
    state.attributes
      .map((attribute: TypeAttribute, index: number) =>{
        return isolate(AttributeField, index)(sources)
      }))
  const attributesReducer$ = attributesSinks$
    .compose(pick('onion'))
    .compose(mix(xs.merge))

  const attributesDOM$ = attributesSinks$
    .compose(pick('DOM'))
    .compose(mix(xs.combine))
    .map(list => _.map(list, AttributeRow))

  const vdom$ = xs.combine(
    onion.state$,
    NameField.DOM,
    SlugField.DOM,
    attributesDOM$,
  ).map(apply(view))

  return {
    DOM: vdom$,
    onion: xs.merge(
      reducer,
      NameField.onion,
      SlugField.onion,
      attributesReducer$,
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
        console.log('click')
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
      actions.addAttribute.map(TypeFormReducer.addAttribute),
      actions.cancel.map(evt => TypeFormReducer.init()),
    ),

    router: actions.cancel.mapTo('/types')
  }
}

function view(
  state: State,
  NameField: VNode,
  SlugField: VNode,
  AttributesList: VNode[],
): VNode {
  return (
    div([
      form(`.form.${classes.form}`, [
        fieldset([
          h3(`.${classes.title}`, 'Type info'),

          div(`.${formClasses.row}`, [
            label(`.${formClasses.field}`, [
              SlugField,
            ])
          ]),

          div(`.${formClasses.row}`, [
            label(`.${formClasses.field}`, [
              NameField,
            ]),
          ]),
        ]),

        fieldset(`.${classes.attributes}`, [
          h3(`.${classes.title}`, 'Type attributes'),
          div(
            AttributesList,
          )
        ]),

        div(`.${formClasses.row}`, [
          button(`.add-attr.${classes.addAttribute}`, 'Add attribute')
        ]),

        div(`.${formClasses.row}.right`, [
          button(`.cancel.${formClasses.flatButton}`, [
            'Cancel'
          ]),

          button(`.${formClasses.primaryButton}`, { attrs: { type: 'submit'}}, [
            'Save'
          ]),
        ]),
      ]),
    ])
  )
}

function AttributeRow(AttributeField: VNode): VNode {
  return (
    div('.row.removable', { style: classes.expandRowTransition }, [
      AttributeField,

      button('.remove-row', [
        icon('cross')
      ]),
    ])
  )
}
