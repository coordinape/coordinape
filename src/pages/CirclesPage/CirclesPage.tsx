// TODO
// add current epoch
// add vouching/distribution
// add hover buttons
// display a circle you're not in

import { useEffect } from 'react';

import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

import { useApiBase } from 'hooks';
import { useCurrentOrgId } from 'hooks/gql/useCurrentOrg';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const CirclesPage = () => {
  const navigate = useNavigate();
  const { selectAndFetchCircle } = useApiBase();
  const [currentOrgId, setCurrentOrgId] = useCurrentOrgId();
  const address = useConnectedAddress();

  const query = useQuery('myOrgs', () =>
    client.query({
      organizations: [
        {},
        {
          id: true,
          name: true,
          circles: [
            {},
            {
              id: true,
              name: true,
              vouching: true,
              users: [
                { where: { address: { _eq: address?.toLowerCase() } } },
                { role: true },
              ],
            },
          ],
        },
      ],
    })
  );

  const orgs = query.data?.organizations;

  useEffect(() => {
    if (orgs && !currentOrgId) {
      setCurrentOrgId(orgs[0].id);
    }
  }, [orgs]);

  const pickCircle = (id: number) => {
    setCurrentOrgId(orgs?.find(o => o.circles.some(c => c.id === id))?.id);
    selectAndFetchCircle(id).then(() => navigate(paths.history));
  };

  const role = (circle: { users: Record<any, any>[] }) => {
    if (circle.users.length === 0) return 'Non-Member';
    const user = circle.users[0];
    if (user.role === 2) return 'Circle Admin';
    if (user.role === 1) return 'Circle Admin';
  };

  return (
    <SingleColumnLayout>
      {query.isLoading && 'Loading...'}
      {orgs?.map(org => (
        <Box key={org.id} css={{ mb: '$lg' }}>
          <Box css={{ display: 'flex' }}>
            <Text variant="sectionHeader" css={{ mb: '$md', flexGrow: 1 }}>
              {org.name}
            </Text>
            <Button color="blue" size="small" outlined>
              Add Circle
            </Button>
          </Box>
          <Box css={{ display: 'flex', flexDirection: 'column', gap: '$md' }}>
            {org.circles.map(circle => (
              <Panel
                key={circle.id}
                css={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '$md',
                }}
                onClick={() => pickCircle(circle.id)}
              >
                <Box
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 3fr',
                    width: '100%',
                    gap: '$md',
                    alignItems: 'center',
                    '> .buttons': {
                      visibility: 'hidden',
                    },
                    '&:hover > .buttons': {
                      visibility: 'visible',
                    },
                  }}
                >
                  <Box>
                    <Text variant="sectionHeader" css={{ mb: '$xs' }}>
                      {circle.name}
                    </Text>
                    <Text>{role(circle)}</Text>
                  </Box>
                  <Box>Epoch ???</Box>
                  <Box>Something</Box>
                  <Box
                    className="buttons"
                    css={{
                      display: 'flex',
                      gap: '$md',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Button outlined color="teal">
                      History
                    </Button>
                    <Button outlined color="teal">
                      Allocation
                    </Button>
                    <Button outlined color="teal">
                      Map
                    </Button>
                    {circle.vouching && (
                      <Button outlined color="teal">
                        Vouching
                      </Button>
                    )}
                    {circle.users[0]?.role === 1 && (
                      <Button outlined color="teal">
                        Admin
                      </Button>
                    )}
                  </Box>
                </Box>
              </Panel>
            ))}
          </Box>
        </Box>
      ))}
    </SingleColumnLayout>
  );
};

export default CirclesPage;
