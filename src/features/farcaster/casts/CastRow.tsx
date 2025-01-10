import Linkify from 'linkify-react';
import { Path } from 'path-parser';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../../routes/paths';
import { Flex, Text } from '../../../ui';
import { Cast } from '../../activities/cast';
import { LightboxImage } from 'ui/MarkdownPreview/LightboxImage';

export const CastRow = ({ cast }: { cast: Cast }) => {
  const userPath = new Path('/surprise/:username');
  const skillPath = new Path('/:skill');
  let givePartyUsername: string | null = null;
  let givePartySkill: string | null = null;
  const givePartyPath = extractGivePartyPath(cast.text_with_mentions);
  if (givePartyPath) {
    const userParams = userPath.test(givePartyPath);
    if (userParams) {
      givePartyUsername = userParams['username'];
    } else {
      const skillParams = skillPath.test(givePartyPath);
      if (skillParams) {
        givePartySkill = skillParams['skill'];
      }
    }
  }
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
            {givePartyUsername || givePartySkill ? (
              <Flex>
                Party Zone SurpriseParty:{givePartyUsername} SkillParty:
                {givePartySkill}
              </Flex>
            ) : (
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
            )}
          </Text>
        </Flex>
        <Flex column>
          {/*images*/}
          {cast.embeds
            ?.filter(emb => emb.type === 'image')
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

function extractGivePartyPath(text: string): string | null {
  const regex = /https:\/\/give\.party(\/[^\s'"]*)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}
