import css from 'app/style/global'

export default css({
  display: 'inline-block',
  width: '1em',
  height: '1em',
  strokeWidth: '0',
  stroke: 'currentColor',
  fill: 'currentColor',

  '&.icon-images': {
    width: '1.125em'
  },

  '&.icon-books': {
    width: '1.125em'
  },

  '&.icon-tags': {
    width: '1.25em'
  },

  '&.icon-embed': {
    width: '1.25em'
  }
})
