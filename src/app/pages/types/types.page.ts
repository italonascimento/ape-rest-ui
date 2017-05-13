import {Sources, Reducer, ViewMode} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {DOMSource, VNode, div, h1, h3, ul, li, p, a, span} from '@cycle/dom'
import xs from 'xstream'
import TypesReducer from './types.reducer'
import {State} from './types.state'
import {RequestInput} from '@cycle/http'
import isolate from '@cycle/isolate'
import TypesList from './components/types-list/types-list'

interface Model {
  reducer$: Stream<Reducer<State>>
}

interface Actions {
  newType$: Stream<any>
}


export default function (sources: Partial<Sources>) {
  const {onion, DOM} = sources

  const typesList = isolate(TypesList, 'typesList')(sources)

  const currentComponent = typesList.DOM

  const vdom$ = currentComponent
    .map(view)

  const {reducer$} = model(intent(DOM))

  return {
    DOM: vdom$,
    HTTP: typesList.HTTP,
    onion: xs.merge(reducer$, typesList.onion)
  }
}

function intent(DOM: DOMSource): Actions {
  return {
    newType$: DOM
      .select('.new-type')
      .events('click')
  }
}

function model(actions: Actions): Model {
  const newTypeReducer$: Stream<Reducer<State>> = actions.newType$
    .mapTo(TypesReducer.newType())

    return {
      reducer$: newTypeReducer$
    }
}

function view(currentComponent: VNode): VNode {
  return (
    div('.page.types-page',
    [
      h1('.page_title', 'Types'),

      currentComponent
    ])
  )
}
