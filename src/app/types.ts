import {DOMSource, VNode} from '@cycle/dom'
import {StateSource} from 'cycle-onionify'
import {Stream} from 'xstream'
import {GenericInput} from '@cycle/history'

export interface Sources {
  DOM: DOMSource
  onion: StateSource<any>
  history: Stream<GenericInput>
}

export interface Sinks {
  DOM: Stream<VNode>
  onion: Stream<Reducer<any>>
}

export type Component = (sources: Partial<Sources>) => Partial<Sinks>

export type Reducer<T> = (prev?: T) => T | undefined
