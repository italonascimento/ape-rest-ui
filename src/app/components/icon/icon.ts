import {svg, h} from '@cycle/dom'
import icon from './icon.style'

export default function(name: string){
  return (
    svg(`.${icon}.icon-${name}`, [
      h('use', { attrs: { 'xlink:href': `/icons/icons.svg#icon-${name}` }})
    ])
  )
}
