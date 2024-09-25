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
  // add accept terms to list
  const { address, hasName, hasOwnKey, acceptedTOS } = progress;
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
      <Step label="Choose Name" test={hasName} />
      <Step label="Accept Terms" test={acceptedTOS} />
      <Step label="Buy Your Own Link" test={hasOwnKey} />
    </Flex>
  );
};
