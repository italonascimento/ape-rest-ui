import {VNode, p} from '@cycle/dom'
import isolate from '@cycle/isolate'
import {TypesPage} from './pages/types.page'

export interface Route {
  path: string,
  view: any,
}

export const routes: Route[] = [
  {
    path: '/',
    view: isolate(TypesPage, 'typesPage')
  }
]
