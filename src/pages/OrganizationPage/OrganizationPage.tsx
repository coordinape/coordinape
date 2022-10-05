import { isUserAdmin } from 'lib/users';
import sortBy from 'lodash/sortBy';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { OrgLogoUpload, LoadingModal } from 'components';
import { scrollToTop } from 'components/MainLayout/MainLayout';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { CircleRow } from 'pages/CirclesPage/CirclesPage';
import { paths } from 'routes/paths';
import { AppLink, Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData, QUERY_KEY_MY_ORGS } from './getOrgData';

import type { Awaited } from 'types/shim';
type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

export const OrganizationPage = () => {
  const orgId = Number.parseInt(useParams().orgId ?? '-1');
  const navigate = useNavigate();
  const address = useConnectedAddress();
  const query = useQuery(
    [QUERY_KEY_MY_ORGS, orgId],
    () => getOrgData(orgId, address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );
  const org = query.data?.organizations_by_pk;

  const goToCircle = (id: number, path: string) => {
    scrollToTop();
    navigate(path);
  };

  if (query.isLoading || query.isIdle || query.isRefetching)
    return <LoadingModal visible note="OrganizationPage" />;

  if (!org) {
    navigate(paths.circles);
    return <></>;
  }

  const isAdmin = (org: Required<QueryResult>['organizations_by_pk']) =>
    org.circles.map(c => c.users[0]).some(u => u && isUserAdmin(u));

  return (
    <SingleColumnLayout>
      <Box key={org.id} css={{ mb: '$lg' }}>
        <Flex row css={{ mb: '$lg', alignItems: 'baseline' }}>
          <Box css={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <OrgLogoUpload
              id={org.id}
              original={org.logo}
              isAdmin={isAdmin(org)}
              name={org.name || ''}
            />
            <Text h2 bold css={{ ml: '$sm', '@sm': { fontSize: '$large' } }}>
              {org.name || ''}
            </Text>
          </Box>
          {isAdmin(org) && (
            <AppLink to={paths.createCircle + '?org=' + org.id}>
              <Button
                color="primary"
                outlined
                css={{ whiteSpace: 'nowrap', ml: '$sm' }}
              >
                Add Circle
              </Button>
            </AppLink>
          )}
        </Flex>
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '$xl' }}>
          {sortBy(org.circles, c => [-c.users.length, c.name]).map(circle => (
            <CircleRow
              circle={circle}
              key={circle.id}
              onButtonClick={goToCircle}
            />
          ))}
        </Box>
      </Box>
    </SingleColumnLayout>
  );
};

export default OrganizationPage;
