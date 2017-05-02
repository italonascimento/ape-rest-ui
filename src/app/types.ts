import {DOMSource, VNode} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import {
  GenericInput,
  HistoryInput,
  Location,
} from '@cycle/history'
import {Stream} from 'xstream'

export type Reducer<T> = (prev?: T) => T | undefined;

export interface Sources {
  DOM: DOMSource
  onion: StateSource<any>
  history: Stream<string | HistoryInput | GenericInput | Location>
}

export interface Sinks {
  DOM: Stream<VNode>,
  onion: Stream<Reducer<any>>,
  history: Stream<string | HistoryInput | GenericInput | Location>
}
