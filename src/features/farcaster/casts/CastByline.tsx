import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../../routes/paths';
import { Avatar, Flex, Link, Text } from '../../../ui';
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
      <AvatarAndName cast={cast} />
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

const AvatarAndName = ({
  cast,
}: {
  cast: {
    address: string;
    fname: string;
    avatar_url: string;
    created_at: string;
  };
}) => {
  return (
    <Link as={NavLink} to={coLinksPaths.profilePosts(cast.address || '')}>
      <Flex
        alignItems="center"
        css={{
          flexGrow: 0,
          minWidth: 0,
        }}
      >
        <Avatar
          size="xxs"
          name={cast.fname}
          path={cast.avatar_url}
          css={{ mr: '$sm' }}
        />
        <Text
          color="heading"
          size="xs"
          semibold
          css={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          {cast.fname}
        </Text>
      </Flex>
    </Link>
  );
};
