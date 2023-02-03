import { useEffect, useState } from 'react';

import { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import CircleWithLogo from '../../components/CircleWithLogo';
import { fetchGuildInfo } from '../../features/guild/fetchGuildInfo';
import { Guild } from '../../features/guild/Guild';
import { GuildInfoWithMembership } from '../../features/guild/guild-api';
import { ExternalLink } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { AppLink, Box, CenteredBox, Link, Panel, Text } from '../../ui';

import { JoinCircleForm } from './JoinCircleForm';
import { getProfilesWithAddress } from './queries';

import { Awaited } from 'types/shim';

type Users = NonNullable<
  Awaited<ReturnType<typeof getProfilesWithAddress>>
>['users'];

export const AddressIsNotMember = ({
  tokenJoinInfo,
  address,
  users,
}: {
  tokenJoinInfo: TokenJoinInfo;
  address: string;
  users: Users;
}) => {
  const [loading, setLoading] = useState(false);

  const [guildInfo, setGuildInfo] = useState<GuildInfoWithMembership>();

  useEffect(() => {
    if (tokenJoinInfo.circle.guild_id) {
      fetchGuildInfo(
        tokenJoinInfo.circle.guild_id,
        address,
        tokenJoinInfo.circle.guild_role_id
      ).then(setGuildInfo);
    }
  }, [tokenJoinInfo]);

  return (
    <CenteredBox>
      <Box>
        <Box
          css={{
            mb: '$lg',
          }}
        >
          <Text h1 css={{ fontSize: '$h1Temp' }}>
            You&apos;re not a member of {tokenJoinInfo.circle.name}
          </Text>
        </Box>

        {tokenJoinInfo.circle.guild_id ? (
          <Box css={{ mb: '$2xl', textAlign: 'left' }}>
            {!guildInfo && <Text>Loading Guild...</Text>}
            {guildInfo && (
              <Box>
                <Box>
                  <Text css={{ alignItems: 'center' }}>
                    This circle allows members of&nbsp;
                    <Link
                      href={`https://guild.xyz/${guildInfo.url_name}`}
                      target="_blank"
                      rel="noreferrer"
                      css={{ display: 'flex', alignItems: 'center' }}
                    >
                      their Guild <ExternalLink css={{ ml: '$xs' }} />
                    </Link>
                    &nbsp;to join:
                  </Text>
                </Box>
                <Guild
                  info={guildInfo}
                  role={tokenJoinInfo.circle.guild_role_id}
                  css={{ my: '$md' }}
                />
                {guildInfo.isMember && (
                  <JoinCircleForm
                    tokenJoinInfo={tokenJoinInfo}
                    loading={loading}
                    setLoading={setLoading}
                  />
                )}
              </Box>
            )}
          </Box>
        ) : (
          <Box css={{ my: '$lg' }}>
            <Text p as="p">
              <ul>
                <li>Make sure you are signed in with the correct address.</li>
                <li>
                  Check with the Circle Admin to make sure you are invited.
                </li>
              </ul>
            </Text>
          </Box>
        )}

        {users.length > 0 ? (
          <>
            <Box css={{ textAlign: 'left', mb: '$lg' }}>
              <Text h2 css={{ fontSize: '$h2Temp' }}>
                You are a member of these other circles
              </Text>
            </Box>
            {users.map(u => (
              <AppLink key={u.id} to={paths.history(u.circle_id)}>
                <Panel
                  nested
                  css={{
                    border: '1px solid transparent',
                    mb: '$md',
                    padding: '$sm',
                    cursor: 'pointer',
                    '&:hover': {
                      border: '1px solid $cta',
                    },
                  }}
                >
                  <CircleWithLogo
                    logo={u.circle.logo}
                    name={u.circle.name}
                    orgLogo={u.circle.organization.logo}
                    orgName={u.circle.organization.name}
                  />
                </Panel>
              </AppLink>
            ))}
          </>
        ) : (
          <Box css={{ textAlign: 'center', mb: '$lg' }}>
            <Text h2 css={{ fontSize: '$h2Temp' }}>
              You aren&apos;t a member of any other circles
            </Text>
          </Box>
        )}
      </Box>
    </CenteredBox>
  );
};
