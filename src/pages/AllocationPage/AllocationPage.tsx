import React, { useEffect, useState } from 'react';

import { useLocation, matchPath, useHistory } from 'react-router-dom';

import {
  makeStyles,
  Stepper,
  Step,
  StepButton,
  Button,
} from '@material-ui/core';

import { useSelectedCircleEpoch, useMe, useSelectedAllocation } from 'hooks';
import { getGivePath, getMyTeamPath, getMyEpochPath } from 'routes/paths';

import AllocationEpoch from './AllocationEpoch';
import AllocationGive from './AllocationGive';
import AllocationTeam from './AllocationTeam';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepperRoot: {
    width: '100%',
    justifyContent: 'center',
  },
  stepRoot: {
    maxWidth: '190px',
  },
  title: {
    margin: theme.spacing(8, 0, 0),
    paddingLeft: theme.spacing(1),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 53,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    padding: '10px 24px',
    fontSize: 19.5,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    background: theme.colors.red,
    borderRadius: 13,
    '&:hover': {
      background: theme.colors.darkRed,
    },
  },
  backButton: {
    marginRight: theme.spacing(1.5),
    padding: '10px 24px',
    fontSize: 19.5,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    background: '#B5C1C7',
    borderRadius: 13,
    '&:hover': {
      background: theme.colors.darkRed,
    },
  },
}));

interface IAllocationStep {
  key: number;
  label: string;
  path: string;
}

const STEP_MY_EPOCH = {
  key: 0,
  label: 'My Epoch',
  path: getMyEpochPath(),
} as IAllocationStep;

const STEP_MY_TEAM = {
  key: 1,
  label: 'Select Team',
  path: getMyTeamPath(),
} as IAllocationStep;

const STEP_ALLOCATION = {
  key: 2,
  label: 'Allocate Give',
  path: getGivePath(),
} as IAllocationStep;

const STEPS: IAllocationStep[] = [STEP_MY_EPOCH, STEP_MY_TEAM, STEP_ALLOCATION];

export const AllocationPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    saveGifts,
    saveTeammates,
    giveTokenRemaining,
  } = useSelectedAllocation();
  const { epochIsActive, timingMessage } = useSelectedCircleEpoch();
  const { selectedMyUser, updateMyUser } = useMe();

  const fixedNonReceiver = selectedMyUser?.fixed_non_receiver !== 0;
  const [epochBio, setEpochBio] = useState('');
  const [nonReceiver, setNonReceiver] = useState(false);

  useEffect(() => {
    if (selectedMyUser) {
      setEpochBio(selectedMyUser.bio);
      setNonReceiver(selectedMyUser.non_receiver == 1);
    }
  }, [selectedMyUser]);

  useEffect(() => {
    const matchExactPath = (path: string) =>
      matchPath(location.pathname, {
        exact: true,
        path,
      });
    STEPS.forEach(
      ({ path, key }) => matchExactPath(path) && setActiveStep(key)
    );
  }, [location]);

  const handleSaveEpoch = async () => {
    await updateMyUser({
      bio: epochBio,
      non_receiver: nonReceiver ? 0 : 1,
    });
    setActiveStep(STEP_MY_TEAM.key);
    history.push(STEP_MY_TEAM.path);
  };

  const handleSaveTeamList = async () => {
    await saveTeammates();
    setActiveStep(STEP_ALLOCATION.key);
    history.push(STEP_ALLOCATION.path);
  };

  const handleSaveAllocations = async () => {
    await saveGifts();
  };

  const handleBack = () => {
    const previous = activeStep - 1;
    previous >= 0 && setActiveStep(previous);
    history.push(STEPS[previous].path);
  };

  const handleStep = (step: number) => () => {
    history.push(STEPS[step].path);
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Stepper
        nonLinear
        alternativeLabel
        activeStep={epochIsActive ? activeStep : -1}
        classes={{ root: classes.stepperRoot }}
      >
        {STEPS.map(({ key, label }) => (
          <Step key={key} classes={{ root: classes.stepRoot }}>
            <StepButton
              onClick={handleStep(key)}
              completed={epochIsActive && key < activeStep}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      {!epochIsActive && <h2 className={classes.title}>{timingMessage}</h2>}

      {epochIsActive && selectedMyUser && activeStep === 0 && (
        <>
          <AllocationEpoch
            epochBio={epochBio}
            setEpochBio={setEpochBio}
            nonReceiver={nonReceiver}
            setNonReceiver={setNonReceiver}
            fixedNonReceiver={fixedNonReceiver}
          />
          <div className={classes.buttonContainer}>
            <Button className={classes.backButton} onClick={handleBack}>
              Back
            </Button>
            <Button className={classes.saveButton} onClick={handleSaveEpoch}>
              Save Epoch Settings
            </Button>
          </div>
        </>
      )}

      {epochIsActive && selectedMyUser && activeStep === 1 && (
        <>
          <AllocationTeam />
          <div className={classes.buttonContainer}>
            <Button className={classes.backButton} onClick={handleBack}>
              Back
            </Button>
            <Button className={classes.saveButton} onClick={handleSaveTeamList}>
              Save Teammate List
            </Button>
          </div>
        </>
      )}

      {epochIsActive && activeStep === 2 && (
        <>
          <AllocationGive />
          <div className={classes.buttonContainer}>
            <Button className={classes.backButton} onClick={handleBack}>
              Back
            </Button>
            <Button
              className={classes.saveButton}
              onClick={handleSaveAllocations}
              disabled={giveTokenRemaining < 0}
            >
              Save Allocations
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllocationPage;
