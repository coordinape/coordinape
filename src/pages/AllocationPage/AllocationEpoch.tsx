import React from 'react';

import { makeStyles } from '@material-ui/core';

import { OptInput } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useCircle, useSelectedCircleEpoch } from 'hooks';
import { capitalizedName } from 'utils/string';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(7, 4, 20),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(5, 1, 20),
    },
  },
  title: {
    margin: 0,
    maxWidth: theme.breakpoints.values.md,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  titleTwo: {
    margin: 0,
    fontSize: 27,
    fontWeight: 300,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  epochTiming: {
    margin: 0,
    maxWidth: theme.breakpoints.values.md,
    fontSize: 20,
    fontWeight: 300,
    lineHeight: 2,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optHr: {
    height: 1,
    width: '100%',
    color: theme.colors.primary,
    opacity: 0.5,
  },
  hrWithMax: {
    height: 1,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    color: theme.colors.primary,
    opacity: 0.5,
  },
  bioTextarea: {
    height: 143,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    margin: theme.spacing(2, 0, 8),
    padding: theme.spacing(3),
    resize: 'none',
    fontSize: 20,
    fontWeight: 300,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    background: '#E1E1E1',
    borderRadius: 8,
    wordBreak: 'break-word',
    '&::placeholder': {
      opacity: 0.3,
    },
  },
  optContainer: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  optLabel: {
    margin: 0,
    fontSize: 27,
    fontWeight: 300,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optInputContainer: {
    marginTop: theme.spacing(3),
    width: '100%',
    maxWidth: theme.breakpoints.values.sm,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const ProfilePage = ({
  epochBio,
  setEpochBio,
  nonReceiver,
  setNonReceiver,
  fixedNonReceiver,
}: {
  epochBio: string;
  setEpochBio: (bio: string) => void;
  nonReceiver: boolean;
  setNonReceiver: (val: boolean) => void;
  fixedNonReceiver: boolean;
}) => {
  const classes = useStyles();
  const { epochIsActive, timingMessage } = useSelectedCircleEpoch();
  const { selectedCircle } = useCircle();

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEpochBio(e.target.value);
  };

  return (
    <div className={classes.root}>
      {!epochIsActive && (
        <h2 className={classes.epochTiming}>{timingMessage}</h2>
      )}
      <span className={classes.title}>
        {epochIsActive
          ? 'What have you been working on this epoch?'
          : 'What have you been working on?'}
      </span>
      <hr className={classes.hrWithMax} />
      <textarea
        className={classes.bioTextarea}
        maxLength={MAX_BIO_LENGTH}
        onChange={onChangeBio}
        placeholder={`Tell us about your contributions in the ${capitalizedName(
          selectedCircle?.name
        )} Circle this epoch...`}
        value={epochBio}
      />
      {!fixedNonReceiver ? (
        <>
          <p className={classes.titleTwo}>
            Should you receive {selectedCircle?.token_name || 'GIVE'}{' '}
            distributions in the{' '}
            <b>{capitalizedName(selectedCircle?.name)} Circle</b> this epoch?
          </p>
          <hr className={classes.optHr} />
          <div className={classes.optInputContainer}>
            <OptInput
              isChecked={nonReceiver}
              subTitle="I am paid sufficiently via other channels"
              title="Opt Out"
              updateOpt={() => setNonReceiver(true)}
            />
            <OptInput
              isChecked={!nonReceiver}
              subTitle={`I want to be eligible to receive ${
                selectedCircle?.token_name || 'GIVE'
              }`}
              title="Opt In"
              updateOpt={() => setNonReceiver(false)}
            />
          </div>
        </>
      ) : (
        <>
          <p className={classes.title}>
            Your administrator opted you out of receiving{' '}
            {selectedCircle?.token_name || 'GIVE'}
          </p>
          <hr className={classes.optHr} />
          <div className={classes.optInputContainer}>
            <p className={classes.optLabel}>
              You can still distribute {selectedCircle?.token_name || 'GIVE'} as
              normal. Generally people are opted out of receiving{' '}
              {selectedCircle?.token_name || 'GIVE'} if they are compensated in
              other ways by their organization. Please contact your circle admin
              for more details.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
