import React, { useEffect, useState } from 'react';

import { useLocation, matchPath, useHistory } from 'react-router-dom';

import {
  makeStyles,
  Stepper,
  Step,
  StepButton,
  Button,
  IconButton,
} from '@material-ui/core';

import {
  useApiWithSelectedCircle,
  useAllocation,
  useAllocationController,
} from 'hooks';
import { BalanceIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import {
  STEP_MY_EPOCH,
  STEP_MY_TEAM,
  STEP_ALLOCATION,
  STEPS,
  NO_TEAM_STEPS,
} from 'routes/allocation';

import AllocationEpoch from './AllocationEpoch';
import AllocationGive from './AllocationGive';
import AllocationTeam from './AllocationTeam';

import { IAllocationStep } from 'types';

const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(2, 0, 0),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.colors.primary,
    textAlign: 'center',
    backgroundColor: 'red',
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

export const AllocationPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(0);
  const {
    circleId,
    myUser: selectedMyUser,
    circle: selectedCircle,
    circleEpochsStatus: { epochIsActive },
  } = useSelectedCircle();
  useAllocationController(circleId);
  const {
    localTeammatesChanged,
    localGiftsChanged,
    tokenRemaining,
    completedSteps,
    rebalanceGifts,
    saveGifts,
    saveTeammates,
  } = useAllocation(circleId);

  const { updateMyUser } = useApiWithSelectedCircle();
  const allSteps = !selectedCircle.team_selection ? NO_TEAM_STEPS : STEPS;
  const fixedNonReceiver = selectedMyUser.fixed_non_receiver;
  const [epochBio, setEpochBio] = useState('');
  const [nonReceiver, setNonReceiver] = useState(false);

  useEffect(() => {
    if (selectedMyUser) {
      setEpochBio(selectedMyUser?.bio ?? '');
      setNonReceiver(selectedMyUser.non_receiver);
    }
  }, [selectedMyUser]);

  const epochDirty =
    selectedMyUser?.bio !== epochBio ||
    selectedMyUser.non_receiver !== nonReceiver;

  useEffect(() => {
    const exactStep = allSteps.find(({ path }) =>
      matchPath(location.pathname, {
        exact: true,
        path,
      })
    );
    if (exactStep === undefined) {
      if (!completedSteps.has(STEP_MY_EPOCH)) {
        setActiveStep(STEP_MY_EPOCH.key);
      } else if (!epochIsActive) {
        if (selectedCircle.team_selection) {
          setActiveStep(STEP_MY_TEAM.key);
        }
      } else {
        setActiveStep(STEP_ALLOCATION.key);
      }
    } else {
      setActiveStep(exactStep.key);
    }
  }, [location]);

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
        history.push(_nextStep.path);
      }
    } catch (e) {
      console.warn('handleSaveEpoch', e);
    }
  };

  const handleSaveTeamList = async () => {
    try {
      await saveTeammates();
      if (epochIsActive) {
        setActiveStep(STEP_ALLOCATION.key);
        history.push(STEP_ALLOCATION.path);
      }
    } catch (e) {
      console.warn('handleSaveTeamList', e);
    }
  };

  const handleSaveAllocations = async () => {
    try {
      if (localTeammatesChanged) {
        await saveTeammates();
      }
      await saveGifts();
    } catch (e) {
      console.warn('handleSaveAllocations', e);
    }
  };

  const getHandleStep = (step: IAllocationStep) => () => {
    history.push(step.path);
    setActiveStep(step.key);
  };

  return (
    <div className={classes.root}>
      <Stepper
        nonLinear
        activeStep={activeStep}
        classes={{ root: classes.stepperRoot }}
      >
        {allSteps.map(step => (
          <Step key={step.key} classes={{ root: classes.stepRoot }}>
            <StepButton
              onClick={getHandleStep(step)}
              completed={completedSteps.has(step)}
              disabled={
                (step === STEP_ALLOCATION && !epochIsActive) ||
                (!selectedCircle.team_selection && step === STEP_MY_TEAM)
              }
            >
              {step.buildLabel(selectedCircle)}
            </StepButton>
          </Step>
        ))}
      </Stepper>

      <div className={classes.body}>
        {selectedMyUser && activeStep === 0 && (
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
                  className={classes.saveButton}
                  disabled={!selectedCircle.team_selection && !epochIsActive}
                  onClick={getHandleStep(
                    !selectedCircle.team_selection
                      ? STEP_ALLOCATION
                      : STEP_MY_TEAM
                  )}
                >
                  Continue With Current Settings
                </Button>
              )}
            </div>
          </>
        )}

        {selectedMyUser && activeStep === 1 && (
          <>
            <AllocationTeam />
            <div className={classes.buttonContainer}>
              {localTeammatesChanged ? (
                <Button
                  className={classes.saveButton}
                  onClick={handleSaveTeamList}
                >
                  Save Teammate List
                </Button>
              ) : (
                <Button
                  className={classes.saveButton}
                  disabled={!epochIsActive}
                  onClick={getHandleStep(STEP_ALLOCATION)}
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
                {tokenRemaining} {selectedCircle.tokenName}
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
              {localGiftsChanged && (
                <Button
                  className={classes.saveButton}
                  onClick={handleSaveAllocations}
                  disabled={tokenRemaining < 0}
                >
                  Save Allocations
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllocationPage;
