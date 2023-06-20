import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Check } from '../../icons/__generated';
import { Button, Flex, Modal } from 'ui';

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
    <Modal open={true} showClose={false}>
      <Flex column css={{ gap: '$lg' }}>
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

        <Flex css={{ mt: '$2xl', justifyContent: 'center' }}>
          {MINTING_STEPS.indexOf(currentStep) === MINTING_STEPS.length - 1 ? (
            <Button color="cta" onClick={onReveal}>
              Reveal Your CoSoul
            </Button>
          ) : (
            <></>
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
    <Flex alignItems="center">
      <Flex css={{ width: 48, justifyContent: 'right', mr: '$md' }}>
        {done ? (
          <Check color="cta" />
        ) : (
          activeStep && <LoadingIndicator size={24} />
        )}
      </Flex>
      <Flex
        css={{
          ...(activeStep
            ? {
                fontWeight: '$semibold',
                fontSize: '$large',
              }
            : {}),
        }}
      >
        {step}
      </Flex>
    </Flex>
  );
};
