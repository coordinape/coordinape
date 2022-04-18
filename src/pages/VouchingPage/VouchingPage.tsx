import React, { useState } from 'react';

import { useQuery } from 'react-query';

import { Button, makeStyles } from '@material-ui/core';

import { LoadingModal } from 'components';
import { useSelectedCircle } from 'recoilState/app';

import { getActiveNominees } from './getActiveNominees';
import { NewNominationModal } from './NewNominationModal';
import { NomineeCard } from './NomineeCard';

const useStyles = makeStyles(theme => ({
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
  cannotVouch: {
    color: theme.colors.red,
  },
}));

export const VouchingPage = () => {
  const classes = useStyles();

  const { myUser, circle } = useSelectedCircle();

  const [isNewNomination, setNewNomination] = useState<boolean>(false);
  const cannotVouch = circle.only_giver_vouch && myUser.non_giver;

  const circleId = circle?.id;

  const {
    isLoading,
    isError,
    isIdle,
    error,
    refetch,
    data: activeNominees,
  } = useQuery(
    ['activeNominees', circleId],
    () => getActiveNominees(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,

      //minmize background refetch
      refetchOnWindowFocus: false,

      notifyOnChangeProps: ['data'],
    }
  );

  if (isLoading || isIdle) return <LoadingModal visible />;
  if (isError) {
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }

  return !circle ? (
    <div className={classes.root}></div>
  ) : (
    <div className={classes.root}>
      <h2 className={classes.title}>Add Circle Members</h2>
      <p className={classes.description}>
        {circle.vouchingText}
        {cannotVouch && (
          <span className={classes.cannotVouch}>
            <br />
            You do not have permission to nominate or vouch in this circle.
          </span>
        )}
      </p>
      <Button
        variant="contained"
        color="primary"
        className={classes.nominateButton}
        disabled={cannotVouch}
        onClick={() => setNewNomination(true)}
      >
        Nominate New Member
      </Button>
      <span className={classes.subTitle}>Vouch For Nominees</span>
      <div className={classes.nomineeContainer}>
        {activeNominees?.map(nominee => (
          <NomineeCard
            key={nominee.id}
            nominee={nominee}
            refetchNominees={refetch}
          />
        ))}
      </div>
      {isNewNomination && (
        <NewNominationModal
          onClose={() => setNewNomination(false)}
          visible={isNewNomination}
          refetchNominees={refetch}
        />
      )}
    </div>
  );
};

export default VouchingPage;
