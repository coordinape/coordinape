import { Button, Flex, Text } from '../../../ui';

import { getPrice } from './getPrice';

export const SimpleBuyButton = ({ links }: { links: number }) => {
  const price = getPrice(links);
  return (
    <Flex css={{ alignItems: 'center', gap: '$sm' }}>
      <Text size="xs" color={'complete'} semibold>
        {price} ETH
      </Text>
      <Button size="xs" color={'cta'}>
        Buy
      </Button>
    </Flex>
  );
};
