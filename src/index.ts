import {run, Driver, Drivers} from '@cycle/run'
import {makeDOMDriver, VNode, DOMSource} from '@cycle/dom'
import onionify from 'cycle-onionify'
import {StateSource} from 'cycle-onionify'
import {App} from './app/app'
import {
  makeHistoryDriver,
  captureClicks,
  GenericInput,
  HistoryInput,
  Location,
} from '@cycle/history'
import {Stream} from 'xstream'

export interface State {

}

export type Reducer = (prev?: State) => State | undefined;

export interface Sources {
  DOM: DOMSource
  onion: StateSource<State>
  history: Stream<string | HistoryInput | GenericInput | Location>
}

export interface Sinks {
  DOM: Stream<VNode>,
  onion: Stream<Reducer>,
  history: Stream<string | HistoryInput | GenericInput | Location>
}

const wrappedMain = onionify(App)

const drivers: Drivers<Partial<Sources>, Partial<Partial<Sinks>>> = {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver())
}

run(wrappedMain, drivers)
