import { artWidthMobile } from 'features/cosoul/constants';
import { client } from 'lib/gql/client';
import Linkify from 'linkify-react';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import '../../features/mentions';

import { coLinksPaths } from '../../routes/paths';
import { Avatar, ContentHeader, Flex, Link, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

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
          <Flex
            column
            css={{ gap: '$xl', maxWidth: `${artWidthMobile}` }}
          ></Flex>
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
        return <Cast key={cast.hash} cast={cast} />;
      })}
    </Flex>
  );
};

const Cast = ({ cast }: { cast: Cast }) => {
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
        <AvatarAndName cast={cast} />
        <Link
          color="neutral"
          target="_blank"
          rel="noreferrer"
          href={warpcastUrl(cast)}
        >
          <Flex column>
            <Text
              inline
              key={cast.hash}
              css={{ whiteSpace: 'pre-wrap', pl: '40px' }}
            >
              <Linkify
                options={{
                  render: {
                    mention: ({ attributes, content }) => {
                      const { ...props } = attributes;
                      const mentionedAddress = cast.mentioned_addresses?.find(
                        ma => ma.fname == content.substring(1)
                      )?.address;
                      if (!mentionedAddress) {
                        return <span {...props}>{content}</span>;
                      }
                      return (
                        <NavLink
                          to={coLinksPaths.profileGive(mentionedAddress)}
                        >
                          {content}
                        </NavLink>
                      );
                    },
                  },
                }}
              >
                {cast.text_with_mentions}
              </Linkify>
            </Text>
            <Flex>
              <Text size="small" css={{ color: '$neutral' }}>
                {cast.like_count} likes
              </Text>
              <Text size="small" css={{ color: '$neutral', pl: '$sm' }}>
                {cast.recast_count} recasts
              </Text>
              <Text size="small" css={{ color: '$neutral', pl: '$sm' }}>
                {cast.replies_count} replies
              </Text>
            </Flex>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
};

const AvatarAndName = ({ cast }: { cast: Cast }) => {
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
          size="small"
          name={cast.fname}
          path={cast.avatar_url}
          css={{ mr: '$sm' }}
        />
        <Text color="heading" semibold css={{ textDecoration: 'none' }}>
          {cast.fname}
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
    </Link>
  );
};

type Cast = Awaited<ReturnType<typeof fetchCasts>>[number];

const fetchCasts = async () => {
  const { getCasts } = await client.query(
    {
      getCasts: [
        {
          payload: {},
        },
        {
          casts: {
            text: true,
            text_with_mentions: true,
            like_count: true,
            recast_count: true,
            replies_count: true,
            created_at: true,
            hash: true,
            fid: true,
            mentioned_addresses: { address: true, fname: true },
            fname: true,
            avatar_url: true,
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'CastsPage__getCasts @cached(ttl: 300)',
    }
  );

  return getCasts?.casts ?? [];
};

const warpcastUrl = (cast: Cast) => {
  return `https://warpcast.com/${cast.fname}/0${cast.hash.slice(1, 9)}`;
};
