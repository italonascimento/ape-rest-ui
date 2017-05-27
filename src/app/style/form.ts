import css from './global'
import {colors} from './theme'

export default {
  row: css({
    display: 'block',
    borderBottom: `1px solid ${colors.border}`,

    ':not(:first-child)': {
      marginTop: '8px'
    }
  }),

  field: css({
    display: 'block',
    height: '100%',

    '& input, & textarea': {
      border: 'none',
      display: 'block',
      height: '100%',
      width: '100%',
      padding: '8px'
    }
  }),
}
