import React, { useState, useEffect } from 'react';

import { Button, makeStyles } from '@material-ui/core';

import { useValSelectedCircle } from 'recoilState';

import NewNominateModal from './NewNominateModal';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(5, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    margin: theme.spacing(1),
    fontSize: 40,
    fontWeight: 700,
    color: theme.colors.primary,
  },
  description: {
    margin: theme.spacing(1),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  nominateButton: {
    margin: theme.spacing(8, 2),
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 3),
    fontSize: 19.5,
    lineHeight: 1.75,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    background: theme.colors.red,
    borderRadius: 13,
    '&.MuiButton-root:hover': {
      background: theme.colors.darkRed,
    },
  },
  subTitle: {
    maxWidth: theme.breakpoints.values.md,
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
    border: 'solid',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightBorder,
  },
}));

export const VouchingPage = () => {
  const classes = useStyles();
  const circle = useValSelectedCircle();
  const [isNewNominate, setNewNominate] = useState<boolean>(false);

  return !circle ? (
    <div className={classes.root}></div>
  ) : (
    <div className={classes.root}>
      <h2 className={classes.title}>Add Circle Members</h2>
      <p className={classes.description}>
        {(circle.vouching_text || '').length == 0 ? (
          <>
            Think someone new should be added to the {circle.name} circle?
            <br />
            Nominate or vouch for them here.
          </>
        ) : (
          circle.vouching_text
        )}
      </p>
      <Button
        className={classes.nominateButton}
        onClick={() => setNewNominate(true)}
      >
        Nominate New Member
      </Button>
      <span className={classes.subTitle}>Vouch For Nominees</span>
      {isNewNominate && (
        <NewNominateModal
          onClose={() => {
            setNewNominate(false);
          }}
          visible={isNewNominate}
        />
      )}
    </div>
  );
};

export default VouchingPage;
