import { useEffect } from 'react';

import { artWidthMobile } from 'features/cosoul/constants';
import {
  link_holders_select_column,
  order_by,
} from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, ContentHeader, Flex, Link, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';
import { BarChart } from 'icons/__generated';

export const CastsPage = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Casts / CoLinks</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Casts from CoLinks Community
          </Text>
          <Text inline>
            What <i>are</i> people saying?
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <Flex
          css={{
            gap: '$xl',
            '@tablet': {
              flexWrap: 'wrap',
            },
          }}
        >
          <Flex
            column
            css={{
              gap: '$md',
              flexGrow: 1,
              maxWidth: '$readable',
            }}
          >
            <CastsList />
          </Flex>
          <Flex column css={{ gap: '$xl', maxWidth: `${artWidthMobile}` }}>
            <Text
              as={NavLink}
              to={coLinksPaths.linking}
              h2
              semibold
              css={{ textDecoration: 'none', color: '$text' }}
            >
              <Flex
                css={{
                  // justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '$md',
                  width: '100%',
                }}
              >
                <BarChart /> Linking Activity
                <Text size="xs" color={'cta'}>
                  View More
                </Text>
              </Flex>
            </Text>

            <RecentCoLinkTransactions limit={14} />
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};

const CastsList = () => {
  const { data: colinks_users } = useQuery(['fids'], fetchColinksUsers, {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const fids: number[] =
    colinks_users?.map(user => user?.farcaster_account?.fid) ?? [];

  const { data: casts } = useQuery(
    ['casts'],
    () => {
      return fetchCasts(fids);
    },
    {
      enabled: !!colinks_users && !!fids,
    }
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ colinks_users, casts });
  }, [colinks_users, casts]);

  if (!colinks_users || !fids || !casts) return null;

  return (
    <Flex column>
      {casts?.map(cast => {
        const profile = colinks_users.find(
          user => user?.farcaster_account?.fid === cast.fid
        );

        if (!profile) return null;

        return (
          <Flex
            css={{
              gap: '$md',
              background: '$surface',
              p: '$md',
              m: '$sm',
              borderRadius: '$2',
            }}
            key={cast.hash}
          >
            <Flex column>
              <AvatarAndName cast={cast} profile={profile} />
              <Link color="neutral" href={warpcastUrl(cast, profile)}>
                <Text
                  key={cast.hash}
                  css={{ whiteSpace: 'pre-wrap', pl: '40px' }}
                >
                  {cast.text}
                </Text>
              </Link>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};

const AvatarAndName = ({
  cast,
  profile,
}: {
  cast: Cast;
  profile: CoLinksUser;
}) => {
  if (!profile) return null;

  return (
    <Flex
      alignItems="center"
      css={{
        flexGrow: 0,
        minWidth: 0,
      }}
    >
      <Avatar
        size="small"
        name={profile.name}
        path={profile.avatar}
        hasCoSoul={!!profile.cosoul}
        css={{ mr: '$sm' }}
      />
      <Text color="heading" semibold css={{ textDecoration: 'none' }}>
        {profile.name}
      </Text>

      <Text
        size="small"
        css={{
          pl: '$sm',
          color: '$neutral',
          textDecoration: 'none',
        }}
      >
        {DateTime.fromISO(cast.created_at).toRelative()}
      </Text>
    </Flex>
  );
};

type CoLinksUser = Awaited<ReturnType<typeof fetchColinksUsers>>[number];
const fetchColinksUsers = async () => {
  const { link_holders } = await client.query(
    {
      link_holders: [
        {
          distinct_on: [link_holders_select_column.holder],
          where: {
            holder_profile_public: {
              farcaster_account: {},
            },
          },
          limit: 1000,
        },
        {
          holder_profile_public: {
            avatar: true,
            name: true,
            address: true,
            cosoul: {
              id: true,
            },
            farcaster_account: {
              fid: true,
              followers_count: true,
              custody_address: true,
              username: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'CastsPage__fetchColinksFids @cached(ttl: 300)',
    }
  );

  if (!link_holders) return [];

  return link_holders.map(lh => lh.holder_profile_public);
};

type Cast = Awaited<ReturnType<typeof fetchCasts>>[number];

const fetchCasts = async (fids: number[]) => {
  const { farcaster_casts } = await client.query(
    {
      farcaster_casts: [
        {
          where: {
            fid: { _in: fids },
            parent_hash: { _is_null: true }, // only top-level casts
          },
          order_by: [{ created_at: order_by.desc }],
        },
        {
          created_at: true,
          text: true,
          hash: true,
          fid: true,
        },
      ],
    },
    {
      operationName: 'CastsPage__fetchCasts @cached(ttl: 300)',
    }
  );

  return farcaster_casts;
};

const warpcastUrl = (cast: Cast, profile: CoLinksUser) => {
  return `https://warpcast.com/${profile?.farcaster_account?.username}/0${cast.hash.slice(1, 9)}`;
};
