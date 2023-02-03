import GuildLogo from '../../assets/svgs/guild-logo.svg';
import { CSS } from '../../stitches.config';
import { Flex, Image, Panel, Text } from '../../ui';
import { ExternalLink } from 'icons/__generated';

import { GuildInfoWithMembership } from './guild-api';

export const Guild = ({
  info,
  role,
  css,
}: {
  info: GuildInfoWithMembership;
  css?: CSS;
  role?: number;
}) => {
  return (
    <Panel
      as={'a'}
      nested
      css={{ ...css, textDecoration: 'none' }}
      href={`https://guild.xyz/${info.url_name}`}
      target="_blank"
      rel="noreferrer"
    >
      <Flex column>
        <Flex>
          <Flex css={{ flexGrow: 1, alignItems: 'center' }}>
            <Flex css={{ background: '$avatarFallback', borderRadius: 9999 }}>
              <Image
                src={guildLogo(info.image_url)}
                css={{
                  width: 48,
                  height: 48,
                  borderRadius: 9999,
                }}
                alt={`${info.name} guild logo`}
              />
            </Flex>
            <Flex column css={{ ml: '$md', flexGrow: 1 }}>
              <Flex
                css={{
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: '$xs',
                }}
              >
                <Flex
                  css={{
                    flexShrink: 1,
                    mr: '$sm',
                    background: '$avatarFallback',
                    borderRadius: 9999,
                    padding: '$sm',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    css={{
                      width: 18,
                      height: 18,
                      color: '$text',
                      mt: '-2px',
                      pt: '2px',
                    }}
                    src={GuildLogo}
                  />
                </Flex>
                <Text h2 css={{ flexGrow: 1, fontSize: '$h2Temp' }}>
                  {info.name}
                  <ExternalLink css={{ ml: '$sm' }} />
                </Text>
              </Flex>
              {role &&
                info.roles.map(r => {
                  if (r.id == role) {
                    return <Text variant="label">Required Role: {r.name}</Text>;
                  }
                })}
              {info.isMember !== undefined &&
                (info.isMember ? (
                  <Text size="small" color="complete">
                    {role
                      ? 'You are a Guild member with the correct role. '
                      : 'You are a Guild member.'}
                  </Text>
                ) : (
                  <Text size="small" color="alert">
                    {role
                      ? 'You do not have the required Guild role.'
                      : 'You are not a Guild member.'}
                  </Text>
                ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Panel>
  );
};

const guildLogo = (fragment: string) => {
  if (!fragment) {
    return '';
  }
  if (fragment.startsWith('https')) {
    return fragment;
  }
  return 'https://guild.xyz' + fragment;
};
