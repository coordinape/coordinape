import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';

import { useEpochsStatus } from 'recoilState/app';

import { ICircle } from 'types';

const useStyles = makeStyles(theme => ({
  link: {
    position: 'relative',
    margin: theme.spacing(0, 0, 0, 5),
    padding: 0,
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 1.6,
    color: theme.colors.text,
    fontWeight: 300,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    '&:hover': {
      color: theme.colors.black,
    },
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: '6px 0',
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: 'normal',
    },
  },
  selectedLink: {
    '&::before': {
      content: '" "',
      position: 'absolute',
      top: '11px',
      left: '-16px',
      width: '8px',
      height: '8px',
      backgroundColor: theme.colors.red,
      borderRadius: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      color: `${theme.colors.red} !important`,
      '&::before': { content: 'none' },
    },
  },
  activeLink: {
    color: theme.colors.darkRed,
  },
}));

export const CircleButton = ({
  circle,
  selected,
  onClick,
}: {
  circle: ICircle;
  selected: boolean;
  onClick: () => void;
}) => {
  const classes = useStyles({});
  const { currentEpoch } = useEpochsStatus(circle.id);

  return (
    <button
      className={clsx(classes.link, {
        [classes.selectedLink]: selected,
        [classes.activeLink]: !!currentEpoch,
      })}
      key={circle.name}
      onClick={onClick}
    >
      {circle.name}
    </button>
  );
};
