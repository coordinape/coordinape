import { makeStyles, ButtonBase } from '@material-ui/core';

import { Edit3 } from 'icons/__generated';

const useStyles = makeStyles(theme => ({
  editCircleButton: {
    backgroundColor: theme.colors.alert,
    borderRadius: '8px',
    width: '32px',
    height: '32px',
  },
}));

export const IconButton = () => {
  const classes = useStyles();
  return (
    <ButtonBase className={classes.editCircleButton}>
      <Edit3 />
    </ButtonBase>
  );
};
