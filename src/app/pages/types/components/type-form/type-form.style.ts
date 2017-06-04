import css from 'app/style'
import {colors} from 'app/style/theme'

export default {
  form: css({
    maxWidth: '640px',
    margin: '32px auto',

    '& .row.removable': {
      position: 'relative',

      '& .remove-row': {
        width: '24px',
        height: '24px',
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '8px',
        cursor: 'pointer',
        opacity: 0,
        visibility: 'hidden',
        transform: 'scale(0.8)',
        transition: 'opacity 0.15s ease-in, transform 0.15s ease-in, visibility 0.15s',

        '&:hover, &:focus, &:active': {
          background: colors.lighter,
        }
      },
      '&:hover .remove-row': {
        transition: 'opacity 0.15s ease-in, transform 0.15s ease-in, visibility 0s',
        visibility: 'visible',
        opacity: 1,
        transform: 'scale(1)',
      }
    }
  }),

  addAttribute: css({
    padding: '12px',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    background: 'none',
    cursor: 'pointer',
    color: colors.gray,
    borderColor: colors.lightGray,
    borderWidth: `1px`,
    borderStyle: 'dashed',

    '&:hover, &:active, &:focus': {
      borderColor: colors.primary,
      color: colors.primary,
      background: colors.lighter,
    },

    '&:active': {
      background: colors.light,
    }
  }),

  expandRowTransition: {
    overflow: 'hidden',
    maxHeight: '0px',
    opacity: '0',
    paddingTop: '0',
    transition: 'max-height 0.15s ease-in-out, margin-top 0.15s ease-in-out',

    delayed: {
      maxHeight: `47px`,
      paddingTop: '16px',
      opacity: '1',
    },

    remove: {
      maxHeight: '0px',
      opacity: '0',
      marginTop: '0',
    }
  }
}
