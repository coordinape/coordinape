import React, { useState } from 'react';

import { useAuthStore } from 'features/auth';
import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { NavLink, useParams } from 'react-router-dom';

import { ActivityList } from '../activities/ActivityList';
import { LoadingModal } from 'components';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { givePaths } from 'routes/paths';
import { Avatar, Box, Button, ContentHeader, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData, QUERY_KEY_ORG_DATA } from './getOrgData';
import { OrgBanner } from './OrgBanner';

import type { Awaited } from 'types/shim';

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

export const OrgPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const orgId = Number.parseInt(useParams().orgId ?? '-1');
  const navigate = useNavigate();
  const profileId = useAuthStore(state => state.profileId);

  const query = useQuery(
    [QUERY_KEY_ORG_DATA, orgId],
    () => getOrgData(orgId, profileId as number),
    {
      enabled: !!profileId,
      staleTime: Infinity,
    },
  );
  const org = query.data?.organizations_by_pk;

  if (query.isLoading || query.isIdle || query.isRefetching)
    return <LoadingModal visible note="OrganizationPage" />;

  if (!org) {
    navigate(givePaths.home);
    return <></>;
  }

  const isAdmin = (org: Required<QueryResult>['organizations_by_pk']) =>
    org.circles.map(c => c.users[0]).some(u => u && isUserAdmin(u));

  return (
    <SingleColumnLayout>
      <Box key={org.id} css={{ mb: '$lg' }}>
        <ContentHeader>
          <Flex
            column
            css={{
              gap: '$md',
              flexGrow: 1,
              width: '100%',
            }}
          >
            <Flex css={{ justifyContent: 'space-between' }}>
              <Flex
                column
                css={{
                  gap: '$md',
                  flexGrow: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                }}
              >
                <Text h1 css={{ gap: '$sm' }}>
                  <Avatar path={org.logo} size="small" name={org.name || ''} />
                  {org.name || ''} Activity
                </Text>
              </Flex>
              {isAdmin(org) && (
                <Flex css={{ gap: '$sm', alignItems: 'flex-start' }}>
                  <Button
                    as={NavLink}
                    to={givePaths.organizationSettings(orgId)}
                    color="primary"
                  >
                    Settings
                  </Button>
                  <Button
                    as={NavLink}
                    to={givePaths.createCircle + '?org=' + org.id}
                    color="cta"
                  >
                    Add Circle
                  </Button>
                </Flex>
              )}
            </Flex>
            <ContributionForm
              orgId={org.id}
              showLoading={showLoading}
              onSave={() => setShowLoading(true)}
            />
          </Flex>
        </ContentHeader>
        <OrgBanner orgId={org.id} />
        <Box css={{ mt: '$lg' }}>
          <ActivityList
            queryKey={['org-activities', org.id]}
            where={{ organization_id: { _eq: org.id } }}
            pollForNewActivity={showLoading}
            onSettled={() => setShowLoading(false)}
          />
        </Box>
      </Box>
    </SingleColumnLayout>
  );
};
