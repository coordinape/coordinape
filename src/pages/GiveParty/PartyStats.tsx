import { ComponentProps } from 'react';

import { Flex, Text } from '../../ui';
import { CertificateLight, Links } from 'icons/__generated';

import { PartyGiveReceived } from './PartyGiveReceived';

export const PartyStats = ({
  links,
  score,
  size = 'xs',
  profileId,
}: {
  links: number;
  score: number;
  profileId?: number;
  size?: ComponentProps<typeof Text>['size'];
}) => {
  return (
    <Flex
      css={{
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: '$sm',
        columnGap: '$lg',
        justifyContent: 'center',
      }}
    >
      <Text
        size={size}
        title={'Rep Score'}
        color={'secondary'}
        css={{
          gap: '$xs',
          whiteSpace: 'nowrap',
        }}
      >
        <Text semibold size={size}>
          {abbreviateNumber(score)}
        </Text>
        <CertificateLight nostroke />
        Rep
      </Text>
      <Text
        size={size}
        color={'secondary'}
        title={'Links'}
        css={{
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        <Text semibold size={size}>
          {abbreviateNumber(links ?? 0)}
        </Text>
        <Links nostroke />
        CoLinks
      </Text>
      {profileId && <PartyGiveReceived profileId={profileId} />}
    </Flex>
  );
};

export function abbreviateNumber(num: number): string {
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
