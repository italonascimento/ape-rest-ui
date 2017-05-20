import {Sources, Sinks, Reducer, ViewMode, ViewComponent} from 'app/types'
import {MemoryStream, Stream} from 'xstream'
import {DOMSource, VNode, div, h1, h3, ul, li, p, a, span} from '@cycle/dom'
import xs from 'xstream'
import TypesReducer from './types.reducer'
import {State} from './types.state'
import {RequestInput} from '@cycle/http'
import isolate from '@cycle/isolate'
import TypesListComponent from './components/types-list/types-list'
import TypeFormComponent from './components/type-form/type-form'

interface Model {
  reducer$: Stream<Reducer<State>>
}

interface Actions {
  newType$: Stream<any>
}


export default function (sources: Partial<Sources>) {
  const {onion, DOM} = sources

  const {reducer$} = model(intent(DOM))

  const TypesList = isolate(TypesListComponent, 'typesList')(sources)
  const TypeForm = isolate(TypeFormComponent, 'typeForm')(sources)


  const vdom$ = xs.combine(
    onion.state$,
    TypesList.DOM,
    TypeForm.DOM)
    .map(combined => view.apply(null, combined))

  return {
    DOM: vdom$,
    HTTP: xs.merge(TypesList.HTTP),
    onion: xs.merge(reducer$, TypesList.onion, TypeForm.onion)
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

function view(state: State, TypesList: VNode, TypeForm: VNode): VNode {
  return (
    div('.page.types-page',
    [
      h1('.page_title', 'Types'),

      ul('.toolbar', [
        li('.toolbar_item', [
          a('.button.new-type', 'New type')
        ])
      ]),

      state.viewMode === ViewMode.List ?
      TypesList :
      null,

      state.viewMode === ViewMode.Edit ?
      TypeForm :
      null,
    ])
  )
}
