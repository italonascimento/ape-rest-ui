import {run, Driver, Drivers} from '@cycle/run'
import {makeDOMDriver, VNode} from '@cycle/dom'
import onionify from 'cycle-onionify'
import {makeHistoryDriver, captureClicks} from '@cycle/history'
import {App} from 'app/app'
import {Sources, Sinks} from 'app/types'

const wrappedMain = onionify(App)

const drivers: Drivers<Partial<Sources>, Partial<Partial<Sinks>>> = {
  DOM: makeDOMDriver('#app'),
  history: captureClicks(makeHistoryDriver())
}

run(wrappedMain, drivers)
