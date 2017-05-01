import {Component} from './types'
import {TypesPage} from './pages/types'
import isolate from '@cycle/isolate'

export interface Route {
  path: string,
  component: Component,
}

export const routes: Route[] = [
  {
    path: '/',
    component: isolate(TypesPage, 'typesPage')
  }
]
