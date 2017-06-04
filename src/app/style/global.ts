import {css} from 'glamor'
import {fonts} from './theme'
import 'glamor/reset'

css.global('*', {
  boxSizing: 'border-box',
  fontFamily: fonts.primary
})

export default css
