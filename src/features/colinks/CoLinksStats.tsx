import { ComponentProps } from 'react';

import { Badge, Users } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Flex, Text } from '../../ui';

export const CoLinksStats = ({
  links,
  score,
  size = 'xs',
  address,
  holdingCount,
}: {
  links: number;
  score: number;
  address?: string;
  size?: ComponentProps<typeof Text>['size'];
  holdingCount: number;
}) => {
  return (
    <Flex css={{ gap: size === 'xs' ? '$sm' : '$md' }}>
      <Text
        as={AppLink}
        to={coLinksPaths.score(address ?? '')}
        size={size}
        title={'Rep Score'}
        color={'secondary'}
        css={{ gap: '$xs' }}
      >
        <Badge
          nostroke
          css={{
            height: 20,
            width: 20,
            '*': { fill: '$secondaryText' },
          }}
        />
        <Text semibold size={size}>
          {abbreviateNumber(score)}
        </Text>
      </Text>
      <Text
        size={size}
        color={'secondary'}
        as={AppLink}
        title={'Links'}
        to={coLinksPaths.holdings(address ?? '')}
        css={{ gap: size === 'xs' ? '$xs' : '$sm' }}
      >
        <Users css={{ height: 16, width: 16 }} />
        <Text semibold size={size}>
          {abbreviateNumber(links ?? 0)}
        </Text>
      </Text>
      {holdingCount > 0 && (
        <Text tag size="xs" color="cta">
          You Hold {holdingCount}
        </Text>
      )}
    </Flex>
  );
};

function abbreviateNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 10000) {
    // Convert to thousands with one decimal place
    let abbreviated = (num / 1000).toFixed(1);
    abbreviated = abbreviated.replace(/\.0$/, '');
    return abbreviated + 'k';
  } else {
    // For 10000 and above, round down to the nearest thousand
    return Math.floor(num / 1000) + 'k';
  }
}
