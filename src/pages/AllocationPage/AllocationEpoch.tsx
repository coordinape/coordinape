import React, { useEffect, useState } from 'react';

import capitalize from 'lodash/capitalize';
import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { useApiWithSelectedCircle } from '../../hooks';
import { STEP_ALLOCATION, STEP_MY_TEAM } from '../../routes/allocation';
import { IAllocationStep } from '../../types';
import { OptInput, ActionDialog, ApeInfoTooltip } from 'components';
import { MAX_BIO_LENGTH } from 'config/constants';
import { useSelectedCircle } from 'recoilState/app';
import { Button, Text } from 'ui';

import SaveButtonContainer from './SaveButtonContainer';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: theme.breakpoints.values.lg,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(8, 4, 20),
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
    color: theme.colors.headingText,
    textAlign: 'center',
  },
  titleTwo: {
    margin: 0,
    fontSize: 27,
    fontWeight: 300,
    lineHeight: 1.3,
    color: theme.colors.text,
    textAlign: 'center',
  },
  optHr: {
    height: 1,
    width: '100%',
    color: theme.colors.text,
    opacity: 0.5,
  },
  hrWithMax: {
    height: 1,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    color: theme.colors.text,
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
    border: `1px solid ${theme.colors.border}`,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflowY: 'scroll',
    background: theme.colors.surface,
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
    color: theme.colors.text,
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
  divTitle: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

const AllocationEpoch = ({
  setActiveStep,
  getHandleStep,
}: {
  setActiveStep: (step: number) => void;
  getHandleStep: (step: IAllocationStep) => () => void;
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { updateMyUser } = useApiWithSelectedCircle();

  const [optOutOpen, setOptOutOpen] = useState(false);

  const {
    circleId,
    circle: selectedCircle,
    circleEpochsStatus: { epochIsActive, timingMessage },
    myUser,
  } = useSelectedCircle();

  const [epochBio, setEpochBio] = useState('');
  const fixedNonReceiver = myUser.fixed_non_receiver;
  const [nonReceiver, setNonReceiver] = useState(false);

  // FIXME: why would this ever change
  useEffect(() => {
    if (myUser) {
      setEpochBio(myUser?.bio ?? '');
      setNonReceiver(myUser.non_receiver);
    }
  }, [myUser]);

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEpochBio(e.target.value);
  };

  const epochDirty =
    myUser?.bio !== epochBio || myUser.non_receiver !== nonReceiver;

  const handleSaveEpoch = async () => {
    try {
      await updateMyUser({
        bio: epochBio,
        non_receiver: nonReceiver,
        epoch_first_visit: false,
      });

      if (!(!selectedCircle.team_selection && !epochIsActive)) {
        const _nextStep = !selectedCircle.team_selection
          ? STEP_ALLOCATION
          : STEP_MY_TEAM;
        setActiveStep(_nextStep.key);
        navigate(_nextStep.pathFn(circleId));
      }
    } catch (e) {
      console.warn('handleSaveEpoch', e);
    }
  };

  return (
    <>
      <div className={classes.root}>
        {!epochIsActive && <Text h3>{timingMessage}</Text>}
        <div className={classes.divTitle}>
          <span className={classes.title}>
            {epochIsActive
              ? 'What have you been working on this epoch?'
              : 'What have you been working on?'}
          </span>
          <ApeInfoTooltip>
            An Epoch is a period of time where circle members contribute value &
            allocate {selectedCircle.tokenName} tokens to one another.{' '}
            <a
              rel="noreferrer"
              target="_blank"
              href="https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/record-contributions#my-epoch"
            >
              Learn More
            </a>
          </ApeInfoTooltip>
        </div>
        <hr className={classes.hrWithMax} />
        <textarea
          className={classes.bioTextarea}
          maxLength={MAX_BIO_LENGTH}
          onChange={onChangeBio}
          placeholder={`Tell us about your contributions in the ${selectedCircle?.name} Circle this epoch...`}
          value={epochBio}
        />
        {!fixedNonReceiver ? (
          <>
            <p className={classes.titleTwo}>
              Should you receive {selectedCircle?.token_name || 'GIVE'}{' '}
              distributions in the{' '}
              <b>{capitalize(selectedCircle?.name)} Circle</b> this epoch?
            </p>
            <hr className={classes.optHr} />
            <div className={classes.optInputContainer}>
              <OptInput
                isChecked={nonReceiver}
                subTitle="I am paid sufficiently via other channels"
                title="Opt Out"
                updateOpt={() => {
                  if (myUser.give_token_received > 0) {
                    setOptOutOpen(true);
                  } else {
                    setNonReceiver(true);
                  }
                }}
              />
              <OptInput
                isChecked={!nonReceiver}
                subTitle={`I want to be eligible to receive ${
                  selectedCircle?.token_name || 'GIVE'
                }`}
                title="Opt In"
                updateOpt={() => setNonReceiver(false)}
              />
              <ActionDialog
                open={optOutOpen}
                title={`If you Opt Out you will lose your ${
                  myUser.give_token_received
                } ${selectedCircle?.token_name || 'GIVE'}`}
                onClose={() => setOptOutOpen(false)}
                onPrimary={() => {
                  setNonReceiver(true);
                  setOptOutOpen(false);
                }}
                primaryText="Proceed to Opt Out"
              >
                Opting out during an in-progress epoch will result in any{' '}
                {selectedCircle?.token_name || 'GIVE'} you have received being
                returned to senders. Are you sure you wish to proceed? This
                cannot be undone.
              </ActionDialog>
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
                You can still distribute {selectedCircle?.token_name || 'GIVE'}{' '}
                as normal. Generally people are opted out of receiving{' '}
                {selectedCircle?.token_name || 'GIVE'} if they are compensated
                in other ways by their organization. Please contact your circle
                admin for more details.
              </p>
            </div>
          </>
        )}
      </div>
      <SaveButtonContainer>
        {epochDirty ? (
          <Button size="large" color="primary" onClick={handleSaveEpoch}>
            Save Epoch Settings
          </Button>
        ) : (
          <Button
            size="large"
            color="primary"
            disabled={!selectedCircle.team_selection && !epochIsActive}
            onClick={getHandleStep(
              !selectedCircle.team_selection ? STEP_ALLOCATION : STEP_MY_TEAM
            )}
          >
            Continue With Current Settings
          </Button>
        )}
      </SaveButtonContainer>
    </>
  );
};

export default AllocationEpoch;
