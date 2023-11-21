import useConnectedAddress from '../../hooks/useConnectedAddress';
import { Avatar, Flex, Text } from '../../ui';

import { BuyOrSellCoLinks } from './BuyOrSellCoLinks';
import { CoLinksProvider } from './CoLinksContext';

export const FeaturedLink = ({
  target,
}: {
  target: {
    avatar?: string;
    name: string;
    address: string;
    count?: number;
    countName?: string;
  };
}) => {
  const address = useConnectedAddress(true);

  return (
    <Flex
      column
      key={target.address}
      css={{
        gap: '$sm',
        width: '100%',
        pb: '$md',
        borderBottom: '1px solid $borderDim',
      }}
    >
      <Flex
        css={{
          justifyContent: 'space-between',
          gap: '$md',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Flex css={{ alignItems: 'center', gap: '$md' }}>
          <Avatar path={target.avatar} name={target.name} size="small" />
          <Text inline semibold size="small">
            {target.name}
          </Text>
        </Flex>
        {target.count && target.countName && (
          <Text tag color={'secondary'} inline size="small">
            {target.count} {target.countName}
          </Text>
        )}
      </Flex>
      <CoLinksProvider>
        <BuyOrSellCoLinks
          hideTitle={true}
          subject={target.address}
          address={address}
          buyOneOnly={true}
        />
      </CoLinksProvider>
    </Flex>
  );
};
