import {VNode, div, h1, h3, ul, li, p, a, span} from '@cycle/dom'
import {Type} from 'app/service/models'
import {Triphasic} from 'app/types'
import * as _ from 'lodash'

export function TypesList(types: Type[], pending: Triphasic): VNode {
  return (
    div('.list-mode',
    {
      class: {'types--loading': pending === Triphasic.Pending},
    },
    [
      types.length ?
      ul('.types_list',
        _.map(types, type =>
          li('test')
        )
      ) :
      div('.types_empty-list', [
        p('No types to show')
      ])
    ])
  )
}
