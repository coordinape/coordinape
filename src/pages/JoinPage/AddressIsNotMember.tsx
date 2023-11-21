import assert from 'assert';
import { useEffect, useState } from 'react';

import { TokenJoinInfo } from '../../../api/join/[token]';
import CircleWithLogo from '../../components/CircleWithLogo';
import { fetchGuildInfo } from '../../features/guild/fetchGuildInfo';
import { Guild } from '../../features/guild/Guild';
import { GuildInfoWithMembership } from '../../features/guild/guild-api';
import { givePaths } from '../../routes/paths';
import { AppLink, Box, CenteredBox, Panel, Text } from '../../ui';

import { JoinForm } from './JoinForm';
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

  const group = tokenJoinInfo.circle
    ? { ...tokenJoinInfo.circle, org: false }
    : {
        ...tokenJoinInfo.organization,
        org: true,
      };

  useEffect(() => {
    if (group?.guild_id) {
      fetchGuildInfo(group.guild_id, address, group.guild_role_id).then(
        setGuildInfo
      );
    }
  }, [tokenJoinInfo]);

  assert(group);
  return (
    <CenteredBox>
      <Box>
        <Box
          css={{
            mb: '$lg',
          }}
        >
          <Text h1>You&apos;re not a member of {group.name}</Text>
        </Box>

        {group.guild_id ? (
          <Box css={{ mb: '$2xl', textAlign: 'left' }}>
            {!guildInfo && <Text>Loading Guild...</Text>}
            {guildInfo && (
              <Box>
                <Box>
                  <Text
                    css={{ verticalAlign: 'middle', display: 'inline' }}
                    inline
                  >
                    This {group.org ? 'organization' : 'circle'} allows members
                    of their Guild to join:
                  </Text>
                </Box>
                <Guild
                  info={guildInfo}
                  role={group.guild_role_id}
                  css={{ my: '$md' }}
                />
                {guildInfo.isMember && (
                  <JoinForm
                    token={tokenJoinInfo.token}
                    redirectTo={
                      group.org
                        ? givePaths.organization(group.id)
                        : givePaths.circle(group.id)
                    }
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
              <Text h2>You are a member of these other circles</Text>
            </Box>
            {users.map(u => (
              <AppLink key={u.id} to={givePaths.circle(u.circle_id)}>
                <Panel
                  nested
                  css={{
                    mb: '$md',
                    padding: '$sm',
                    cursor: 'pointer',
                    '&:hover': {
                      outline: '1px solid $cta',
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
            <Text h2>You aren&apos;t a member of any other circles</Text>
          </Box>
        )}
      </Box>
    </CenteredBox>
  );
};
