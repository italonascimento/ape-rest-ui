import css from './global'
import {colors} from './theme'
import {merge} from 'glamor'

css.global('input, textarea', {
  outline: 0
})

export const row = css({
  display: 'block',

  ':not(:first-of-type)': {
    marginTop: '8px'
  }
})

export const field = css({
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
})

export const button = css({
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
})

export const primaryButton = merge(button, {
  background: colors.primary,
  color: 'white',
})

export const flatButton = merge(button, {
  background: 'transparent',
  color: colors.primary,
})
