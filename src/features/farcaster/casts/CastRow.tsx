import Linkify from 'linkify-react';
import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { ExternalLink, Farcaster } from '../../../icons/__generated';
import { coLinksPaths } from '../../../routes/paths';
import { Avatar, Flex, Link, Text } from '../../../ui';
import { Cast } from '../../activities/cast';
import { Activity } from '../../activities/useInfiniteActivities';
import { LightboxImage } from 'ui/MarkdownPreview/LightboxImage';

const warpcastUrl = (cast: Cast) => {
  return `https://warpcast.com/${cast.fname}/0${cast.hash.slice(1, 9)}`;
};

export const CastRow = ({ cast }: { cast: Cast; activity: Activity }) => {
  return (
    <Flex
      column
      css={{
        background: '$surface',
        borderRadius: '$2',
        overflow: 'clip',
      }}
      key={cast.hash}
    >
      <Flex
        css={{
          justifyContent: 'space-between',
          background: '$surfaceDim',
          p: '$sm $md',
        }}
      >
        <AvatarAndName cast={cast} />
        <Flex css={{ gap: '$sm', alignItems: 'center' }}>
          <Farcaster fa />
        </Flex>
      </Flex>
      <Flex
        column
        css={{
          gap: '$md',
          width: '100%',
          p: '$md',
        }}
      >
        <Flex column>
          <Text
            inline
            key={cast.hash}
            css={{
              whiteSpace: 'pre-wrap',
              a: {
                color: '$link',
                textDecoration: 'none',
                '&:hover, &:focus': {
                  textDecoration: 'underline',
                  color: '$linkHover',
                },
              },
            }}
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
                      <NavLink to={coLinksPaths.partyProfile(mentionedAddress)}>
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
        </Flex>
        <Flex column>
          {/*images*/}
          {cast.embeds
            .filter(emb => emb.type === 'image')
            .map(embed => (
              <LightboxImage
                key={embed.url}
                alt={embed.url || ''}
                src={embed.url || ''}
              />
            ))}
          {/*everything else*/}
          {/*TODO: this doesnt handle embedded casts, it assumes url*/}
          {/* {cast.embeds
            .filter(emb => emb.type !== 'image')
            .map(embed => (
              <Link
                key={embed.url}
                target="_blank"
                rel="noreferrer"
                href={embed.url}
                css={{ color: '$neutral' }}
              >
                <Text>{embed.url}</Text>
              </Link>
            ))} */}
        </Flex>
        <Flex
          css={{
            justifyContent: 'space-between',
          }}
        >
          <Flex css={{ gap: '$sm' }}>
            <Flex css={{ gap: '$sm', alignItems: 'center' }}>
              <Text tag color="farcaster" size={'xs'} bold>
                Farcaster
                <Farcaster fa />
              </Text>
            </Flex>
            <Text size="small" css={{ color: '$neutral' }}>
              {cast.like_count} likes
            </Text>
            <Text size="small" css={{ color: '$neutral' }}>
              {cast.recast_count} recasts
            </Text>
            <Text size="small" css={{ color: '$neutral' }}>
              {cast.replies_count} replies
            </Text>
          </Flex>
          <Link
            color="neutral"
            target="_blank"
            rel="noreferrer"
            href={warpcastUrl(cast)}
          >
            <Text size="small">
              <ExternalLink css={{ mr: '$xs' }} /> View on Warpcast
            </Text>
          </Link>
        </Flex>
      </Flex>
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
    <Link as={NavLink} to={coLinksPaths.profile(cast.address || '')}>
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
