import React, { useState, useMemo, useEffect } from 'react';

import { useAuthStore } from 'features/auth';
import {
  getOrgMembersPageData,
  QueryMember,
  QUERY_KEY_GET_ORG_MEMBERS_DATA,
} from 'features/orgs/getOrgMembersData';
import { OrgMembersTable } from 'features/orgs/OrgMembersTable';
import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { LoadingModal } from 'components';
import { useToast } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { Search } from 'icons/__generated';
import { useOrgIdParam } from 'routes/hooks';
import { paths } from 'routes/paths';
import { Button, ContentHeader, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export { AddPage as OrgMembersAddPage } from './AddPage';

const OrgMembersPage = () => {
  const { isMobile } = useMobileDetect();
  const { showError } = useToast();
  const [keyword, setKeyword] = useState<string>('');
  const myId = useAuthStore(state => state.profileId);

  const orgId = useOrgIdParam();

  const { error, data } = useQuery(
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

  // User Columns
  const filterMember = useMemo(
    () => (m: QueryMember) => {
      const r = new RegExp(keyword, 'i');
      return r.test(m.profile?.name) || r.test(m.profile.address);
    },
    [keyword]
  );

  const organization = data?.organizations_by_pk;
  if (!organization) return <LoadingModal visible />;
  const { members } = organization;

  const isOrgAdmin = members.some(
    m => m.profile_id === myId && m.profile?.users.some(isUserAdmin)
  );

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Organization Members</Text>
          <Text p as="p">
            View and Manage members.
          </Text>
        </Flex>
        {!isMobile && (
          <Flex
            css={{
              flexGrow: 1,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              gap: '$md',
            }}
          >
            <Text size="small" css={{ color: '$headingText' }}>
              {members.length} Member{members.length > 1 ? 's' : ''}
            </Text>
            {isOrgAdmin && (
              <Button as={NavLink} to={paths.orgMembersAdd(orgId)} color="cta">
                Add Members
              </Button>
            )}
          </Flex>
        )}
      </ContentHeader>

      <Panel css={{ p: '$lg' }}>
        <Flex css={{ justifyContent: 'space-between', mb: '$md' }}>
          <Text large css={{ fontWeight: '$semibold', color: '$headingText' }}>
            Members
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
        <OrgMembersTable
          members={members}
          filter={filterMember}
          perPage={15}
          isAdmin={isOrgAdmin}
        />
      </Panel>
    </SingleColumnLayout>
  );
};

export default OrgMembersPage;
