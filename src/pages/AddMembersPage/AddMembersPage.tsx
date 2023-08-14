import { useEffect, useMemo, useState } from 'react';

import {
  getOrgMembersPageData,
  QueryMember,
  QUERY_KEY_GET_ORG_MEMBERS_DATA,
} from 'features/orgs/getOrgMembersData';
import { client } from 'lib/gql/client';
import { useQuery, useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingModal } from '../../components';
import CopyCodeTextField from '../../components/CopyCodeTextField';
import { fetchGuildInfo } from '../../features/guild/fetchGuildInfo';
import { Guild } from '../../features/guild/Guild';
import { GuildInfo } from '../../features/guild/guild-api';
import { paths } from '../../routes/paths';
import { APP_URL } from '../../utils/domain';
import { useToast } from 'hooks';
import { Search } from 'icons/__generated';
import { QUERY_KEY_CIRCLE_SETTINGS } from 'pages/CircleAdminPage/getCircleSettings';
import { QUERY_KEY_GET_MEMBERS_PAGE_DATA } from 'pages/MembersPage/getMembersPageData';
import { useCircleIdParam } from 'routes/hooks';
import {
  AppLink,
  Box,
  ContentHeader,
  Flex,
  Link,
  Panel,
  Text,
  TextField,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AddOrgMembersTable } from './AddOrgMembersTable';
import CSVImport from './CSVImport';
import InviteLink from './InviteLink';
import NewMemberList, { ChangedUser, NewMember } from './NewMemberList';
import TabButton, { Tab } from './TabButton';
import {
  deleteInviteToken,
  deleteWelcomeToken,
  useInviteToken,
  useWelcomeToken,
} from './useCircleTokens';

export type Group = {
  id: number;
  guild_id?: number;
  guild_role_id?: number;
  name: string;
  organization_id?: number;
  organization?: any;
};

export type GroupType = 'circle' | 'organization';

const AddMembersPage = () => {
  const circleId = useCircleIdParam();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<boolean>(false);

  const { data: inviteLinkUuid, refetch: fetchInviteToken } =
    useInviteToken(circleId);
  const { data: welcomeUuid, refetch: refetchWelcomeToken } =
    useWelcomeToken(circleId);

  const { data } = useQuery(['AddMembers'], () =>
    client.query(
      {
        circles_by_pk: [
          { id: circleId },
          {
            id: true,
            guild_id: true,
            guild_role_id: true,
            name: true,
            organization_id: true,
            organization: {
              name: true,
            },
          },
        ],
      },
      { operationName: 'AddMembers_getCircleData' }
    )
  );

  const circle = data?.circles_by_pk;

  // Wait for initial load, show nothing but loading modal
  if (!inviteLinkUuid || !welcomeUuid || !circle) {
    return <LoadingModal visible />;
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

        // this is not yet implemented for adding members to circles
        existing: false,
      }));

    await queryClient.invalidateQueries([QUERY_KEY_CIRCLE_SETTINGS, circleId]);
    await queryClient.invalidateQueries([
      QUERY_KEY_GET_MEMBERS_PAGE_DATA,
      circleId,
    ]);
    queryClient.invalidateQueries(QUERY_KEY_GET_ORG_MEMBERS_DATA);

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
  showGuild = true,
}: {
  group: Group;
  groupType: GroupType;
  welcomeLink?: string;
  inviteLink: string;
  revokeInvite(): void;
  // revokeWelcome(): void;
  save: (members: NewMember[]) => Promise<ChangedUser[]>;
  showGuild?: boolean;
}) => {
  const { showError } = useToast();

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ETH);

  const [preloadedMembers, setPreloadedMembers] = useState<NewMember[]>([]);

  const [guildInfo, setGuildInfo] = useState<GuildInfo | undefined>(undefined);

  const [guildMessage, setGuildMessage] = useState<string>('');

  const addMembersFromCSV = (newMembers: NewMember[]) => {
    // Switch to ETH tab, set the preloaded values
    setPreloadedMembers(newMembers);
    setCurrentTab(Tab.ETH);
  };

  const orgId = group?.organization_id;
  const { error, data: orgData } = useQuery(
    [QUERY_KEY_GET_ORG_MEMBERS_DATA, orgId],
    () => getOrgMembersPageData(orgId as number),
    {
      enabled: !!orgId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  useEffect(() => {
    if (error instanceof Error) showError(error.message);
  }, [error]);
  const organization = orgData?.organizations_by_pk;

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

  const makeTab = (tab: Tab, content: string) => {
    const TabComponent = () => (
      <TabButton tab={tab} {...{ currentTab, setCurrentTab }}>
        {content}
      </TabButton>
    );
    TabComponent.displayName = `TabComponent(${content})`;
    return TabComponent;
  };

  const TabEth = makeTab(Tab.ETH, 'ETH Address');
  const TabOrg =
    groupType == 'circle' ? makeTab(Tab.ORG, 'Add From Org') : () => null;
  const TabLink = makeTab(Tab.LINK, 'Invite Link');
  const TabCsv = makeTab(Tab.CSV, 'CSV Import');
  const TabGuild = showGuild ? makeTab(Tab.GUILD, 'Guild.xyz') : () => null;

  const [keyword, setKeyword] = useState<string>('');
  // User Columns
  const filterMember = useMemo(
    () => (m: QueryMember) => {
      const r = new RegExp(keyword, 'i');
      return r.test(m.profile?.name) || r.test(m.profile.address);
    },
    [keyword]
  );

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Add Members to {group.name}</Text>
          {groupType == 'organization' && (
            <Text p as="p">
              Org Members can see Circle Membership, Activity, Maps and can
              engage with emoji reactions. Organization members will not
              participate in epochs until invited into a Circle. Individual
              Notes and GIVE are still private.
            </Text>
          )}
          <Text p as="p">
            After adding members you can see and manage them in the{' '}
            <AppLink inlineLink to={memberPath}>
              members table.
            </AppLink>
          </Text>
        </Flex>
      </ContentHeader>

      <Flex css={{ flexWrap: 'wrap', gap: '$sm', mb: '$sm' }}>
        <TabEth />
        <TabOrg />
        <TabLink />
        <TabCsv />
        <TabGuild />
      </Flex>

      <Box css={{ width: '70%', '@md': { width: '100%' } }}>
        <Panel>
          {groupType == 'circle' && currentTab === Tab.ORG && (
            <Box>
              <Text p as="p" css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Select organization members and add them to this circle.
              </Text>
              <Flex css={{ justifyContent: 'space-between', mb: '$md' }}>
                <Text
                  large
                  css={{ fontWeight: '$semibold', color: '$headingText' }}
                >
                  Add {group.organization.name || 'Org'} Members
                </Text>
                <Flex alignItems="center" css={{ gap: '$sm' }}>
                  <Search color="neutral" />
                  <TextField
                    inPanel
                    size="sm"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setKeyword(event.target.value)
                    }
                    placeholder="Search"
                    value={keyword}
                  />
                </Flex>
              </Flex>
              <Text p as="p" css={{ pb: '$md' }} size="small">
                Remove circle members on the&nbsp;
                <Link inlineLink as={NavLink} to={paths.members(group.id)}>
                  members page
                </Link>
                .
              </Text>
              <AddOrgMembersTable
                currentCircleId={group.id}
                members={organization ? organization.members : []}
                filter={filterMember}
                filtering={!!keyword.length}
                save={save}
                welcomeLink={welcomeLink}
              />
            </Box>
          )}
          {currentTab === Tab.ETH && (
            <Box>
              <Text css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Add new members by wallet address.
              </Text>

              <NewMemberList
                {...{ welcomeLink, preloadedMembers, save }}
                group={group}
                groupType={groupType}
              />
            </Box>
          )}
          {currentTab === Tab.LINK && (
            <Box>
              <Text p as="p" css={{ pb: '$lg', pt: '$sm' }} size="medium">
                Add new members by sharing an invite link.
              </Text>
              <InviteLink {...{ inviteLink, groupType }} />
            </Box>
          )}
          {currentTab === Tab.CSV && (
            <Box>
              <Text p as="p" css={{ pb: '$lg', pt: '$sm' }}>
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
                      to={
                        groupType == 'circle'
                          ? paths.circleAdmin(group.id) + '#guild'
                          : paths.organizationSettings(group.id) + '#guild'
                      }
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
                <Text p as="p" css={{ pb: '$lg', pt: '$sm' }}>
                  You can integrate with
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
                    to={
                      groupType == 'circle'
                        ? paths.circleAdmin(group.id) + '#guild'
                        : paths.organizationSettings(group.id) + '#guild'
                    }
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
