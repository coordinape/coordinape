import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useLocation, matchPath, useHistory } from 'react-router-dom';

import {
  makeStyles,
  Stepper,
  Step,
  StepButton,
  Button,
  IconButton,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import {
  useSelectedCircleEpoch,
  useMe,
  useSelectedAllocation,
  useSelectedAllocationController,
} from 'hooks';
import { BalanceIcon } from 'icons';
import { getGivePath, getMyTeamPath, getMyEpochPath } from 'routes/paths';

import AllocationEpoch from './AllocationEpoch';
import AllocationGive from './AllocationGive';
import AllocationTeam from './AllocationTeam';

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
    '& .MuiStepConnector-root': {
      maxWidth: theme.spacing(10),
    },
  },
  body: {
    flex: 1,
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    overflow: 'auto',
    width: '100%',
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
    display: 'flex',
    alignItems: 'center',
    padding: '10px 24px',
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
  saved: {
    background: theme.colors.black,
    '& > *': {
      margin: theme.spacing(0, 0.5),
    },
  },
  backButton: {
    marginRight: theme.spacing(1.5),
    padding: '10px 24px',
    fontSize: 19.5,
    lineHeight: 1.75,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    background: '#B5C1C7',
    borderRadius: 13,
    '&:hover': {
      background: theme.colors.darkRed,
    },
  },
  balanceContainer: {
    position: 'fixed',
    right: 50,
    top: theme.custom.appHeaderHeight + 90,
    zIndex: 1,
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    borderRadius: 8,
    justifyContent: 'flex-start',
    background: 'linear-gradient(0deg, #FAF1F2, #FAF1F2)',
    boxShadow: '2px 3px 6px rgba(81, 99, 105, 0.12)',
  },
  balanceDescription: {
    margin: 0,
    fontSize: 20,
    fontWeight: 300,
    color: theme.colors.primary,
    '&:first-of-type': {
      fontWeight: 500,
      color: theme.colors.red,
    },
  },
  rebalanceButton: {
    color: theme.colors.primary,
    marginLeft: theme.spacing(1),
    padding: '1px',
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

  useSelectedAllocationController();
  const {
    localTeammatesDirty,
    localGiftsDirty,
    tokenRemaining,
    tokenStarting,
    rebalanceGifts,
    saveGifts,
    saveTeammates,
  } = useSelectedAllocation();
  const { epochIsActive, timingMessage } = useSelectedCircleEpoch();
  const { selectedMyUser, updateMyUser, selectedCircle } = useMe();

  const fixedNonReceiver = selectedMyUser?.fixed_non_receiver !== 0;
  const [epochBio, setEpochBio] = useState('');
  const [nonReceiver, setNonReceiver] = useState(false);

  useEffect(() => {
    if (selectedMyUser) {
      setEpochBio(selectedMyUser.bio);
      setNonReceiver(selectedMyUser.non_receiver === 1);
    }
  }, [selectedMyUser]);

  const epochDirty =
    selectedMyUser?.bio !== epochBio ||
    (selectedMyUser?.non_receiver === 1) !== nonReceiver;

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
      non_receiver: nonReceiver ? 1 : 0,
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
    if (localTeammatesDirty) {
      await saveTeammates();
    }
    await saveGifts();
  };

  const handleBack = () => {
    const previous = activeStep - 1;
    previous >= 0 && setActiveStep(previous);
    history.push(STEPS[previous].path);
  };

  const getHandleStep = (step: number) => () => {
    history.push(STEPS[step].path);
    setActiveStep(step);
  };

  return (
    <div className={classes.root}>
      <Stepper
        nonLinear
        activeStep={epochIsActive ? activeStep : -1}
        classes={{ root: classes.stepperRoot }}
      >
        {STEPS.map(({ key, label }) => (
          <Step key={key} classes={{ root: classes.stepRoot }}>
            <StepButton
              onClick={getHandleStep(key)}
              completed={epochIsActive && key < activeStep}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div className={classes.body}>
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
              {epochDirty ? (
                <Button
                  className={classes.saveButton}
                  onClick={handleSaveEpoch}
                >
                  Save Epoch Settings
                </Button>
              ) : (
                <Button
                  className={clsx(classes.saveButton, classes.saved)}
                  onClick={getHandleStep(STEP_MY_TEAM.key)}
                >
                  Continue With Current Settings
                </Button>
              )}
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
              {localTeammatesDirty ? (
                <Button
                  className={classes.saveButton}
                  onClick={handleSaveTeamList}
                >
                  Save Teammate List
                </Button>
              ) : (
                <Button
                  className={clsx(classes.saveButton, classes.saved)}
                  onClick={getHandleStep(STEP_ALLOCATION.key)}
                >
                  Continue with this team
                </Button>
              )}
            </div>
          </>
        )}

        {epochIsActive && activeStep === 2 && (
          <>
            <AllocationGive />
            <div className={classes.balanceContainer}>
              <p className={classes.balanceDescription}>
                {tokenRemaining} {selectedCircle?.token_name || 'GIVE'}
              </p>
              <p className={classes.balanceDescription}>
                &nbsp;left to allocate
              </p>
              <IconButton
                size="small"
                className={classes.rebalanceButton}
                onClick={rebalanceGifts}
                disabled={tokenRemaining === 0}
              >
                <BalanceIcon />
              </IconButton>
            </div>
            <div className={classes.buttonContainer}>
              <Button className={classes.backButton} onClick={handleBack}>
                Back
              </Button>
              {localGiftsDirty ? (
                <Button
                  className={classes.saveButton}
                  onClick={handleSaveAllocations}
                  disabled={
                    tokenRemaining < 0 || tokenRemaining === tokenStarting
                  }
                >
                  Save Allocations
                </Button>
              ) : (
                <div className={clsx(classes.saveButton, classes.saved)}>
                  <CheckIcon />
                  Saved!
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllocationPage;
