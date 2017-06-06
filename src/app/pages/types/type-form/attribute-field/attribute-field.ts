import {Sources} from 'app/types'
import {Singleline} from 'app/components/inputs'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import {apply} from 'app/utils'
import {VNode, div, label, button} from '@cycle/dom'
import {TypeAttribute} from 'app/api/models'
import {icon} from 'app/components'

export type State = TypeAttribute

export default function (sources: Partial<Sources>) {
  const {DOM, onion} = sources

  const NameField = isolate(Singleline, 'name')({
    ...sources,
    props: xs.of({placeholder: 'Name'})
  })
  const SlugField = isolate(Singleline, 'slug')({
    ...sources,
    props: xs.of({placeholder: 'Slug'})
  })

  const vdom$ = xs.combine(
    onion.state$,
    SlugField.DOM,
    NameField.DOM,
  ).map(apply(view))

  return {
    DOM: xs.never(),
    onion: xs.never()
  }
}

function view(state: State, SlugField: VNode, NameField: VNode): VNode {
  return (
    div([
      label('.field', [
        SlugField,
      ]),

      label('.field', [
        NameField,
      ]),

      button('.remove-row', [
        icon('cross')
      ])
    ])
  )
}
