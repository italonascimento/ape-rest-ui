import css from './global'
import {colors} from './theme'
import {merge} from 'glamor'

css.global('input, textarea, button', {
  outline: 0
})

css.global('button', {
  border: 'none',
  background: 'transparent',
})

css.global('fieldset', {
  border: 'none',
  margin: 0,
  padding: 0,
})

export default {
  row: css({
    display: 'block',
    paddingTop: '16px',

    '&.right': {
      textAlign: 'right'
    },

    '&.center': {
      textAlign: 'center'
    },
  }),

  field: css({
    display: 'block',
    height: '100%',

    '& input, & textarea': {
      display: 'block',
      height: '100%',
      width: '100%',
      padding: '8px',
      fontSize: '12px',
      color: colors.dark
    },
  }),

  singleline: css({
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: `1px solid ${colors.light}`,
    transition: 'border-color 0.12s ease-in',

    '&:focus': {
      borderBottom: `1px solid ${colors.primary}`,
    }
  }),

  keyValuePair: css({
    display: 'flex',
    flexDirection: 'row',

    '& input': {
      flex: '1'
    }
  }),

  attributeField: css({
    display: 'flex',
    flexDirection: 'row',

    '& > *': {
      flex: '1'
    }
  }),

  button: css({
    padding: '10px 12px',
    textAlign: 'center',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    minWidth: '80px',
    display: 'inline-block',

    ':not(:first-of-type)': {
      marginLeft: '8px'
    }
  }),

  get primaryButton() {
    return merge(this.button, {
      background: colors.primary,
      color: 'white',
    })
  },

  get flatButton() {
    return merge(this.button, {
      background: 'transparent',
      color: colors.primary,
    })
  }
}
