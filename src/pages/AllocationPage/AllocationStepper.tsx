import React from 'react';

import { makeStyles, Stepper, Step, StepButton } from '@material-ui/core';

import { ApeInfoTooltip } from 'components';
import { useSelectedCircle } from 'recoilState/app';
import { STEP_MY_TEAM, STEP_ALLOCATION } from 'routes/allocation';

import { IAllocationStep } from 'types';

const useStyles = makeStyles(theme => ({
  stepperRoot: {
    width: '100%',
    justifyContent: 'center',
    '& .MuiStepConnector-root': {
      maxWidth: theme.spacing(10),
    },
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  stepRoot: {
    maxWidth: '190px',
  },
  title: {
    margin: theme.spacing(2, 0, 0),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.3,
    color: theme.colors.text,
    textAlign: 'center',
    backgroundColor: 'red',
  },
}));

type AllocationStepperProps = {
  getHandleStep: (step: IAllocationStep) => () => void;
  activeStep: number;
  allSteps: IAllocationStep[];
  completedSteps: Set<IAllocationStep> | undefined;
};

export const AllocationStepper = ({
  getHandleStep,
  activeStep,
  allSteps,
  completedSteps,
}: AllocationStepperProps) => {
  const classes = useStyles();
  const {
    circle: selectedCircle,
    circleEpochsStatus: { epochIsActive },
  } = useSelectedCircle();

  return (
    <Stepper
      nonLinear
      activeStep={activeStep}
      classes={{ root: classes.stepperRoot }}
    >
      {allSteps.map(step => (
        <Step key={step.key} classes={{ root: classes.stepRoot }}>
          <StepButton
            onClick={getHandleStep(step)}
            completed={completedSteps !== undefined && completedSteps.has(step)}
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
          href="https://docs.coordinape.com/info/documentation/gift_circle"
        >
          Learn More
        </a>
      </ApeInfoTooltip>
    </Stepper>
  );
};

export default AllocationStepper;
