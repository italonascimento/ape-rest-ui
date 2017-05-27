import css from './global'
import {colors} from './theme'

css.global('input, textarea', {
  outline: 0
})

export default {
  row: css({
    display: 'block',

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
      padding: '8px',
      fontSize: '12px',
      color: colors.dark
    },

    '& input': {
      borderBottom: `1px solid ${colors.border}`,
      transition: 'border-color 0.12s ease-in',

      '&:focus': {
        borderBottom: `1px solid ${colors.primary}`,
      }
    }
  }),
}
