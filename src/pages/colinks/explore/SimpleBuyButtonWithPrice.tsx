import { useContext } from 'react';

import { BuyButton } from '../../../features/colinks/BuyButton';
import { CoLinksContext } from '../../../features/colinks/CoLinksContext';
import { Flex, Text } from '../../../ui';

import { getPriceWithFees } from './getPriceWithFees';

export const SimpleBuyButtonWithPrice = ({
  links,
  target,
  setProgress,
  onSuccess,
}: {
  links: number;
  target: string;
  setProgress(s: string): void;
  onSuccess(): void;
}) => {
  const { awaitingWallet } = useContext(CoLinksContext);

  const price = getPriceWithFees(links);
  return (
    <Flex css={{ alignItems: 'center', gap: '$sm' }}>
      <Text size="xs" color={'complete'} semibold>
        {price} ETH
      </Text>
      <BuyButton
        setProgress={setProgress}
        onSuccess={onSuccess}
        target={target}
        disabled={awaitingWallet}
        size={'xs'}
        text={'Buy'}
      />
    </Flex>
  );
};
