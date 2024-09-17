import Linkify from 'linkify-react';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../../routes/paths';
import { Flex, Text } from '../../../ui';
import { Cast } from '../../activities/cast';
import { Activity } from '../../activities/useInfiniteActivities';
import { LightboxImage } from 'ui/MarkdownPreview/LightboxImage';

export const CastRow = ({ cast }: { cast: Cast; activity: Activity }) => {
  return (
    <Flex
      column
      css={{
        overflow: 'clip',
        mt: '$sm',
      }}
      key={cast.hash}
    >
      <Flex
        column
        css={{
          gap: '$sm',
          width: '100%',
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
                      <NavLink to={coLinksPaths.profileGive(mentionedAddress)}>
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
      </Flex>
    </Flex>
  );
};
