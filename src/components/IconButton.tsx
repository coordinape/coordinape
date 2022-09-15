import { makeStyles, ButtonBase } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

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
      <EditIcon className={classes.editIcon} />
    </ButtonBase>
  );
};
