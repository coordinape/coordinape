import React from 'react';

import { makeStyles, Button } from '@material-ui/core';

import { INominee } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 330,
    padding: theme.spacing(3),
    backgroundColor: theme.colors.background,
    borderRadius: 11,
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const NomineeCard = ({ nominee }: { nominee: INominee }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h5>{nominee.name}</h5>
      <span>{nominee.description}</span>
      <Button variant="contained" color="secondary" size="small">
        Vouch for {nominee.name}
      </Button>
    </div>
  );
};

export default NomineeCard;
