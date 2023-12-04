import { Check } from 'icons/__generated';
import { Flex, Text } from 'ui';

import { WizardProgress } from './WizardProgress';

const Step = ({ label, test }: { label: string; test?: boolean }) => {
  return (
    <Flex css={{ justifyContent: 'space-between' }}>
      <Text>{label}</Text>
      {test && <Check color="complete" />}
    </Flex>
  );
};

export const WizardList = ({ progress }: { progress: WizardProgress }) => {
  const {
    address,
    onCorrectChain,
    hasName,
    hasRep,
    hasCoSoul,
    hasOwnKey,
    hasOtherKey,
  } = progress;
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        width: '260px',
        background: '$surface',
        position: 'absolute',
        right: '$md',
        bottom: '$md',
        p: '$2xl $lg $lg $xl',
        clipPath: 'polygon(0 50px,60px 0,100% 0,100% 100%,0 100%)',
      }}
    >
      <Step label="Connect Wallet" test={!!address} />
      <Step label="On Optimism" test={onCorrectChain} />
      <Step label="Name" test={hasName} />
      <Step label="CoSoul" test={hasCoSoul} />
      <Step label="Buy Your Own Link" test={hasOwnKey} />
      <Step label="Connect Rep" test={hasRep} />
      <Step label="Buy Other Links" test={hasOtherKey} />
    </Flex>
  );
};
