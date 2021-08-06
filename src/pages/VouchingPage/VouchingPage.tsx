import React, { useState, useEffect } from 'react';

import { Button, makeStyles } from '@material-ui/core';

import { useSelectedCircle, useActiveNominees } from 'recoilState';

import NewNominateModal from './NewNominateModal';
import NomineeCard from './NomineeCard';

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
  nomineeContainer: {
    margin: theme.spacing(1, 5),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

export const VouchingPage = () => {
  const classes = useStyles();
  const circle = useSelectedCircle();
  const activeNominees = useActiveNominees();
  const [isNewNominate, setNewNominate] = useState<boolean>(false);

  return !circle ? (
    <div className={classes.root}></div>
  ) : (
    <div className={classes.root}>
      <h2 className={classes.title}>Add Circle Members</h2>
      <p className={classes.description}>{circle.vouchingText}</p>
      <Button
        variant="contained"
        color="primary"
        className={classes.nominateButton}
        onClick={() => setNewNominate(true)}
      >
        Nominate New Member
      </Button>
      <span className={classes.subTitle}>Vouch For Nominees</span>
      <div className={classes.nomineeContainer}>
        {activeNominees
          .filter(
            (nominee) =>
              nominee.vouches_required - 1 > nominee.nominations.length &&
              nominee.expiryDate.isAfter(Date())
          )
          .map((nominee) => (
            <NomineeCard key={nominee.id} nominee={nominee} />
          ))}
      </div>
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
