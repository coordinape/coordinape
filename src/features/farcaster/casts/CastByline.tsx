import { Flex, Link, Text } from '../../../ui';
import { Cast } from '../../activities/cast';
import { ChartSimple, Farcaster } from 'icons/__generated';

export const warpcastUrl = (cast: Cast) => {
  return `https://warpcast.com/${cast.fname}/0${cast.hash.slice(1, 9)}`;
};

export const CastByline = ({ cast }: { cast: Cast }) => {
  const engagementScore =
    cast.like_count + cast.recast_count + cast.replies_count;

  return (
    <Flex
      css={{
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '$sm',
      }}
    >
      <Link
        color="neutral"
        target="_blank"
        rel="noreferrer"
        href={warpcastUrl(cast)}
      >
        <Text tag color="farcaster" size={'xs'} bold>
          <Farcaster fa />
          Farcaster
          <Text semibold>
            <ChartSimple fa size="sm" css={{ mr: '$xs' }} />
            {engagementScore}
          </Text>
        </Text>
      </Link>
    </Flex>
  );
};
