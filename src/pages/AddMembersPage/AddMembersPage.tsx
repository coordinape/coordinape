import React, { useEffect, useState } from 'react';

import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { LoadingModal } from '../../components';
import CopyCodeTextField from '../../components/CopyCodeTextField';
import { fetchGuildInfo } from '../../features/guild/fetchGuildInfo';
import { Guild } from '../../features/guild/Guild';
import { GuildInfo } from '../../features/guild/guild-api';
import { useApiBase } from '../../hooks/useApiBase';
import { paths } from '../../routes/paths';
import { APP_URL } from '../../utils/domain';
import { QUERY_KEY_CIRCLE_SETTINGS } from 'pages/CircleAdminPage/getCircleSettings';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from 'pages/MembersPage/getMembersPageData';
import { useSelectedCircle } from 'recoilState/app';
import { AppLink, Box, ContentHeader, Flex, Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import CSVImport from './CSVImport';
import InviteLink from './InviteLink';
import NewMemberList, { NewMember, ChangedUser } from './NewMemberList';
import TabButton, { Tab } from './TabButton';
import {
  deleteInviteToken,
  deleteWelcomeToken,
  useInviteToken,
  useWelcomeToken,
} from './useCircleTokens';

const AddMembersPage = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const { circle } = useSelectedCircle(); // FIXME don't use this anymore
  const queryClient = useQueryClient();
  const { fetchCircle } = useApiBase();

  const [loading, setLoading] = useState<boolean>(false);

  const { data: inviteLinkUuid, refetch: fetchInviteToken } =
    useInviteToken(circleId);
  const { data: welcomeUuid, refetch: refetchWelcomeToken } =
    useWelcomeToken(circleId);

  // Wait for initial load, show nothing but loading modal
  if (!inviteLinkUuid || !welcomeUuid) {
    return <LoadingModal visible={true} />;
  }

  const revokeInvite = async () => {
    try {
      setLoading(true);
      await deleteInviteToken(circleId);
      await fetchInviteToken();
    } finally {
      setLoading(false);
    }
  };

  const revokeWelcome = async () => {
    try {
      setLoading(true);
      await deleteWelcomeToken(circleId);
      await refetchWelcomeToken();
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = APP_URL + paths.join(inviteLinkUuid);
  const welcomeLink = APP_URL + paths.welcome(welcomeUuid);

  const save = async (members: { address: string; name: string }[]) => {
    const { createUsers } = await client.mutate(
      {
        createUsers: [
          { payload: { circle_id: circleId, users: members } },
          { UserResponse: { address: true, profile: { name: true } } },
        ],
      },
      { operationName: 'createUsers_newMemberList' }
    );

    const replacedNames = createUsers
      ?.filter(({ UserResponse: r }) =>
        members.find(
          m =>
            m.address.toLowerCase() === r?.address.toLowerCase() &&
            r?.profile.name &&
            m.name !== r?.profile.name
        )
      )
      .map(({ UserResponse: r }) => ({
        oldName: members.find(
          m => m.address.toLowerCase() === r?.address.toLowerCase()
        )?.name,
        newName: r?.profile.name,
        address: r?.address,
      }));

    await queryClient.invalidateQueries([QUERY_KEY_CIRCLE_SETTINGS, circleId]);
    await queryClient.invalidateQueries([
      QUERY_KEY_GET_MEMBERS_PAGE_DATA,
      circleId,
    ]);
    await fetchCircle({ circleId });

    return replacedNames || [];
  };

  return (
    <>
      <LoadingModal visible={loading} />
      <AddMembersContents
        group={circle}
        groupType="circle"
        {...{
          welcomeLink,
          inviteLink,
          revokeInvite,
          revokeWelcome,
          save,
        }}
      />
    </>
  );
};

export const AddMembersContents = ({
  group,
  groupType,
  welcomeLink,
  inviteLink,
  // revokeInvite, TODO: add revoke in a later PR when UI is better defined
  // revokeWelcome,
  save,
}: {
  group: {
    id: number;
    guild_id?: number;
    guild_role_id?: number;
    name: string;
  };
  groupType: 'circle' | 'organization';
  welcomeLink?: string;
  inviteLink: string;
  revokeInvite(): void;
  // revokeWelcome(): void;
  save: (members: NewMember[]) => Promise<ChangedUser[]>;
}) => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ETH);

  const [preloadedMembers, setPreloadedMembers] = useState<NewMember[]>([]);

  const [guildInfo, setGuildInfo] = useState<GuildInfo | undefined>(undefined);

  const [guildMessage, setGuildMessage] = useState<string>('');

  const addMembersFromCSV = (newMembers: NewMember[]) => {
    // Switch to ETH tab, set the preloaded values
    setPreloadedMembers(newMembers);
    setCurrentTab(Tab.ETH);
  };

  useEffect(() => {
    if (group.guild_id) {
      setGuildMessage('Loading Guild...');
      fetchGuildInfo(group.guild_id)
        .then(info => {
          setGuildInfo(info);
          setGuildMessage('');
        })
        .catch(() => setGuildMessage('Unable to load from Guild.xyz'));
    }
  }, []);

  useEffect(() => {
    if (currentTab != Tab.ETH) {
      // reset the preloaded members
      setPreloadedMembers([]);
    }
  }, [currentTab]);

  const memberPath =
    groupType === 'circle'
      ? paths.members(group.id)
      : paths.orgMembers(group.id);

  // eslint-disable-next-line react/display-name
  const makeTab = (tab: Tab, content: string) => () =>
    (
      <TabButton tab={tab} {...{ currentTab, setCurrentTab }}>
        {content}
      </TabButton>
    );

  const TabEth = makeTab(Tab.ETH, 'ETH Address');
  const TabLink = makeTab(Tab.LINK, 'Invite Link');
  const TabCsv = makeTab(Tab.CSV, 'CSV Import');
  const TabGuild = makeTab(Tab.GUILD, 'Guild.xyz');

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Add Members to {group.name}</Text>
          <Text p as="p">
            Note that after adding members you can see and manage them in the{' '}
            <AppLink inlineLink to={memberPath}>
              members table.
            </AppLink>
          </Text>
        </Flex>
      </ContentHeader>

      <Flex css={{ mb: '$sm' }}>
        <TabEth />
        <TabLink />
        <TabCsv />
        <TabGuild />
      </Flex>

      <Box
        css={{
          width: '70%',
          '@md': {
            width: '100%',
          },
        }}
      >
        <Panel>
          {currentTab === Tab.ETH && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Add new members by wallet address.
              </Text>
              <NewMemberList {...{ welcomeLink, preloadedMembers, save }} />
            </Box>
          )}
          {currentTab === Tab.LINK && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Add new members by sharing an invite link.
              </Text>
              <InviteLink inviteLink={inviteLink} />
            </Box>
          )}
          {currentTab === Tab.CSV && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }}>
                Please import a .CSV file with only these two columns: Name,
                Address. &nbsp;
                <Link inlineLink href="/resources/example.csv" download>
                  Download Sample CSV
                </Link>
              </Text>
              <CSVImport addNewMembers={addMembersFromCSV} />
            </Box>
          )}
          {currentTab === Tab.GUILD && (
            <Box>
              {group.guild_id ? (
                <Flex column css={{ mb: '$lg' }}>
                  <Flex
                    alignItems="center"
                    css={{
                      mb: '$lg',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text h2>This {groupType} is connected to Guild.xyz</Text>
                    <Link
                      as={NavLink}
                      inlineLink
                      to={paths.circleAdmin(group.id) + '#guild'}
                      download
                      css={{ ml: '$sm' }}
                    >
                      Edit Settings
                    </Link>
                  </Flex>

                  <Text>{guildMessage}</Text>
                  {guildInfo && (
                    <Guild info={guildInfo} role={group.guild_role_id} />
                  )}
                  {welcomeLink && (
                    <>
                      <Text variant="label" css={{ mb: '$xs', mt: '$lg' }}>
                        Share this link with Guild members
                      </Text>
                      <CopyCodeTextField value={welcomeLink} />
                    </>
                  )}
                </Flex>
              ) : (
                <Text css={{ pb: '$lg', pt: '$sm' }}>
                  You can integrate with{' '}
                  <Link
                    css={{ mx: '$xs' }}
                    target="_blank"
                    rel="noreferrer"
                    inlineLink
                    href="https://guild.xyz"
                  >
                    Guild.xyz
                  </Link>
                  to help people join your {groupType}.
                  <Link
                    as={NavLink}
                    inlineLink
                    to={paths.circleAdmin(group.id) + '#guild'}
                    download
                    css={{ ml: '$sm' }}
                  >
                    Configure Guild.xyz Settings
                  </Link>
                </Text>
              )}
            </Box>
          )}
        </Panel>
        {groupType === 'circle' && (
          <Box css={{ mt: '$lg' }}>
            <Link
              inlineLink
              target="_blank"
              rel="noreferrer"
              href={
                'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/admin-best-practices#ways-to-give'
              }
            >
              Documentation: GIVE Circle Best Practices
            </Link>
          </Box>
        )}
      </Box>
    </SingleColumnLayout>
  );
};

export default AddMembersPage;
