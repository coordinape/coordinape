import { makeStyles } from '@material-ui/core';

const useCommonStyles = makeStyles(theme => ({
  scroll: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: theme.spacing(0.5),
    },
    '&::-webkit-scrollbar-track': {},
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.primary,
    },
  },
  transparentButton: {
    // backgroundColor: opacify(-0.9, theme.colors.white),
    borderRadius: theme.spacing(0.75),
    color: theme.colors.white,
    // "&:hover": {
    //   backgroundColor: opacify(-0.5, theme.colors.white),
    // },
  },
  textAlignRight: {
    textAlign: 'right',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  fadeAnimation: {
    transition: 'all 1s',
    opacity: 0,
    '&.visible': {
      opacity: 1,
    },
  },
  hideBelowWide: {
    [theme.breakpoints.down('sm')]: {
      display: 'none !important',
    },
  },
  showBelowWide: {
    [theme.breakpoints.up('md')]: {
      display: 'none !important',
    },
  },
  maxHeightTransition: {
    overflow: 'hidden',
    maxHeight: 0,
    transition: 'max-height 0.5s cubic-bezier(0, 1, 0, 1)',
    '&.visible': {
      maxHeight: 2000,
      transition: 'max-height 1s ease-in-out',
    },
  },
}));

export default useCommonStyles;
