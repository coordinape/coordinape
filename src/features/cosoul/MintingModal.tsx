import { pulseStyles } from 'features/nav/SideNav';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Check } from '../../icons/__generated';
import { Button, Flex, Modal } from 'ui';

import { coSoulCloud } from './CoSoulArtContainer';

export const MINTING_STEPS = [
  'Build a Reputation on Coordinape',
  'Connect to Optimism',
  'Approve Transaction',
  // 'Reticulate Splines',
  'Engrave on the Blockchain',
  // 'Commission the Artist',
] as const;

export type MintingStep = typeof MINTING_STEPS[number];

const isDone = (step: MintingStep, currentStep: MintingStep) => {
  return MINTING_STEPS.indexOf(step) <= MINTING_STEPS.indexOf(currentStep);
};

export const MintingModal = ({
  onReveal,
  currentStep,
}: {
  onReveal: () => void;
  currentStep: MintingStep;
}) => {
  return (
    <Modal
      loader
      forceTheme="dark"
      open={true}
      showClose={false}
      css={{
        position: 'relative',
        top: '-$lg ',
        overflow: 'hidden',
        '&:before': {
          content: '',
          ...coSoulCloud,
          zIndex: '1 !important',
          top: 'calc(50% - 250px) !important',
        },
        '&:after': {
          content: '',
          background:
            'radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(226,226,226,0) 100%)',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          zIndex: '0 !important',
        },
      }}
    >
      <Flex
        column
        css={{
          gap: '$xs',
          position: 'relative',
          zIndex: '2',
          mt: '$lg',
        }}
      >
        {MINTING_STEPS.map(step => (
          <MintingStepRow
            key={step}
            step={step}
            done={isDone(step, currentStep)}
            activeStep={
              MINTING_STEPS.indexOf(step) ===
              MINTING_STEPS.indexOf(currentStep) + 1
            }
          />
        ))}

        <Flex
          css={{
            mt: '$2xl',
            justifyContent: 'center',
          }}
        >
          {MINTING_STEPS.indexOf(currentStep) === MINTING_STEPS.length - 1 ? (
            <Button
              size="large"
              color="cta"
              onClick={onReveal}
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
                '&:before': {
                  ...pulseStyles,
                  borderRadius: '$3',
                },
                '&:after': {
                  ...pulseStyles,
                  borderRadius: '$3',
                  animationDelay: '1.5s',
                  zIndex: -1,
                },
              }}
            >
              Reveal Your CoSoul
            </Button>
          ) : (
            <Button
              size="large"
              css={{
                zIndex: 3,
                position: 'relative',
                borderRadius: '$3',
                width: '100%',
                visibility: 'hidden',
              }}
            >
              Reveal Your CoSoul
            </Button>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
};

const MintingStepRow = ({
  step,
  done,
  activeStep,
}: {
  step: string;
  done: boolean;
  activeStep: boolean;
}) => {
  return (
    <Flex alignItems="center" css={{ width: '22rem', margin: 'auto' }}>
      <Flex css={{ width: 48, justifyContent: 'right', mr: '$md' }}>
        {done ? (
          <Check color="cta" />
        ) : (
          activeStep && <LoadingIndicator size={24} css={{ margin: 'auto' }} />
        )}
      </Flex>
      <Flex
        css={{
          padding: '$md $md $md $3xl',
          ml: '-$3xl',
          width: '100%',
          borderRadius: '$1',
          ...(activeStep
            ? {
                background: 'rgba(0,0,0,0.6)',
                color: '$cta ',
              }
            : {}),
        }}
      >
        {step}
      </Flex>
    </Flex>
  );
};
