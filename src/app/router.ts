import {VNode, p} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {TypesPage} from 'app/pages/types/types.page'
import {ViewComponent} from 'app/types'

export interface Route {
  path: string,
  view: ViewComponent,
}

export const routes: Route[] = [
  {
    path: '/',
    view: isolate(TypesPage, 'typesPage')
  }
]
