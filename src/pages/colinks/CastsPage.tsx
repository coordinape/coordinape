import { artWidthMobile } from 'features/cosoul/constants';
import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import 'react-farcaster-embed/dist/styles.css'; // include default styles or write your own
import { FarcasterEmbed } from 'react-farcaster-embed/dist/client';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { RecentCoLinkTransactions } from '../../features/colinks/RecentCoLinkTransactions';
import { coLinksPaths } from '../../routes/paths';
import { ContentHeader, Flex, Text } from '../../ui';
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
  const { data: casts } = useQuery(
    ['casts'],
    () => {
      return fetchCasts();
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (!casts) return null;

  return (
    <Flex column>
      {casts?.map(cast => {
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
            <FarcasterEmbed
              username={cast?.farcaster_account?.username}
              hash={`0${cast.hash.slice(1, 9)}`}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};

const fetchCasts = async () => {
  const { farcaster_casts } = await client.query(
    {
      farcaster_casts: [
        {
          where: {
            farcaster_account: {
              profile_public: {
                links_held: { _gt: 0 },
              },
            },
            parent_hash: { _is_null: true }, // only top-level casts
          },
          order_by: [{ created_at: order_by.desc }],
          limit: 100,
        },
        {
          created_at: true,
          text: true,
          hash: true,
          fid: true,
          farcaster_account: {
            fid: true,
            followers_count: true,
            custody_address: true,
            username: true,
            profile_public: {
              avatar: true,
              name: true,
              address: true,
              cosoul: {
                id: true,
              },
            },
          },
        },
      ],
    },
    {
      operationName: 'CastsPage__fetchCasts @cached(ttl: 300)',
    }
  );

  return farcaster_casts;
};
