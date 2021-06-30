import React from 'react';

import { makeStyles } from '@material-ui/core';

import { OptInput } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useCircle } from 'hooks';
import { capitalizedName } from 'utils/string';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.md,
    width: '100%',
    padding: theme.spacing(10, 4, 20),
    display: 'flex',
    flexDirection: 'column',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  titleTwo: {
    margin: 0,
    paddingLeft: theme.spacing(1),
    fontSize: 27,
    fontWeight: 300,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optHr: {
    height: 1,
    width: '100%',
    color: theme.colors.primary,
    opacity: 0.5,
  },
  bioContainer: {
    marginTop: 0,
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bioTextarea: {
    height: 143,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3),
    resize: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    background: 'rgba(81, 99, 105, 0.2)',
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
    fontWeight: 400,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  optInputContainer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  const { selectedCircle } = useCircle();

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEpochBio(e.target.value);
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <p className={classes.title}>
          What have you been working on this epoch?
        </p>
      </div>
      <hr className={classes.optHr} />
      <div className={classes.bioContainer}>
        <textarea
          className={classes.bioTextarea}
          maxLength={MAX_BIO_LENGTH}
          onChange={onChangeBio}
          placeholder={`Tell us about your contributions in the ${capitalizedName(
            selectedCircle?.name
          )} Circle this  epoch...`}
          value={epochBio}
        />
      </div>
      {!fixedNonReceiver ? (
        <>
          <div className={classes.titleContainer}>
            <p className={classes.titleTwo}>
              Should you receive {selectedCircle?.token_name || 'GIVE'}{' '}
              distributions in the{' '}
              <b>{capitalizedName(selectedCircle?.name)} Circle</b> this epoch?
            </p>
          </div>
          <hr className={classes.optHr} />
          <div className={classes.optInputContainer}>
            <OptInput
              isChecked={!nonReceiver}
              subTitle={`I want to be eligible to receive ${
                selectedCircle?.token_name || 'GIVE'
              }`}
              title="Opt In"
              updateOpt={() => setNonReceiver(false)}
            />
            <OptInput
              isChecked={nonReceiver}
              subTitle="I am paid sufficiently via other channels"
              title="Opt Out"
              updateOpt={() => setNonReceiver(true)}
            />
          </div>
        </>
      ) : (
        <>
          <div className={classes.titleContainer}>
            <p className={classes.title}>
              Your administrator opted you out of receiving{' '}
              {selectedCircle?.token_name || 'GIVE'}
            </p>
          </div>
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
