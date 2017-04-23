import {VNode, p} from '@cycle/dom'

export interface Route {
  path: string,
  view: VNode,
}

export const routes: Route[] = [
  {
    path: '/',
    view: p(['Home'])
  }
]
