import { Pencil1Icon } from '@radix-ui/react-icons';

import { makeStyles, ButtonBase } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  editCircleButton: {
    backgroundColor: theme.colors.alert,
    borderRadius: '8px',
    width: '32px',
    height: '32px',
  },
  editIcon: {
    color: theme.colors.white,
  },
}));

export const IconButton = () => {
  const classes = useStyles();
  return (
    <ButtonBase className={classes.editCircleButton}>
      <Pencil1Icon className={classes.editIcon} />
    </ButtonBase>
  );
};
