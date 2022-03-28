import React, { useEffect, useState } from 'react';

import { useLocation, matchPath, useNavigate } from 'react-router-dom';

import {
  makeStyles,
  Stepper,
  Step,
  StepButton,
  IconButton,
  Tooltip,
  Zoom,
} from '@material-ui/core';

import { Button } from '../../ui';
import { ApeInfoTooltip } from 'components';
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
import { EXTERNAL_URL_FEEDBACK } from 'routes/paths';

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
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-160px',
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
  tooltipLink: {
    display: 'block',
    margin: theme.spacing(2, 0, 0),
    marginTop: 16,
    textAlign: 'center',
    color: theme.colors.linkBlue,
    textDecoration: 'underline',
  },
  tooltip: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 300,
    maxWidth: 296,
    padding: theme.spacing(4),
    margin: theme.spacing(0, 2),
    borderRadius: 8,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
  },
  btn: {
    marginTop: 32,
  },
}));

export const AllocationPage = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
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
      matchPath(path, location.pathname)
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
        navigate(_nextStep.path);
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
        navigate(STEP_ALLOCATION.path);
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
    navigate(step.path);
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
        <ApeInfoTooltip>
          Reward your teammates in the circle by sending them{' '}
          {selectedCircle.tokenName} tokens.{' '}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://docs.coordinape.com/welcome/gift_circle#the-gift-circle"
          >
            Learn More
          </a>
        </ApeInfoTooltip>
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
                <Button size="large" color="red" onClick={handleSaveEpoch}>
                  Save Epoch Settings
                </Button>
              ) : (
                <Button
                  size="large"
                  color="red"
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
                  size="large"
                  color="red"
                  onClick={handleSaveTeamList}
                  className={classes.btn}
                >
                  Save Teammate List
                </Button>
              ) : (
                <Button
                  size="large"
                  color="red"
                  disabled={!epochIsActive}
                  onClick={getHandleStep(STEP_ALLOCATION)}
                  className={classes.btn}
                >
                  Continue with this team
                </Button>
              )}
            </div>
            <div className={classes.tooltipContainer}>
              <Tooltip
                title={
                  <div>
                    {' '}
                    <b>Why is Coordinape in my circle?</b>
                    <div>
                      To date Coordinape has offered our service for free. We
                      decided that using the gift circle mechanism as our
                      revenue model might make a lot of sense, so we’re trying
                      that out.
                    </div>
                    <a
                      href={EXTERNAL_URL_FEEDBACK}
                      rel="noreferrer"
                      target="_blank"
                      className={classes.tooltipLink}
                    >
                      Let us know what you think
                    </a>
                  </div>
                }
                placement="top-start"
                TransitionComponent={Zoom}
                leaveDelay={50} // Allows clickable links as content, transition-out animation prevents clicking without a slight delay
                classes={{
                  ...classes,
                }}
                interactive
              >
                <a
                  className={classes.tooltipLink}
                  href={EXTERNAL_URL_FEEDBACK}
                  rel="noreferrer"
                  target="_blank"
                >
                  Why is Coordinape in my circle?
                </a>
              </Tooltip>
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
                  size="large"
                  color="red"
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
