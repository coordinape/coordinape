import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

import { useApiBase } from 'hooks';
import { paths } from 'routes/paths';
import { Box, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const CirclesPage = () => {
  const navigate = useNavigate();
  const { selectAndFetchCircle } = useApiBase();

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
            },
          ],
        },
      ],
    })
  );

  const orgs = query.data?.organizations;

  const pickCircle = (id: number) =>
    selectAndFetchCircle(id).then(() => navigate(paths.history));

  return (
    <SingleColumnLayout>
      {query.isLoading && 'Loading...'}
      {orgs?.map(org => (
        <Box
          key={org.id}
          css={{
            mb: '$lg',
            display: 'flex',
            flexDirection: 'column',
            gap: '$md',
          }}
        >
          <Text variant="sectionHeader">{org.name}</Text>
          {org.circles.map(circle => (
            <Panel
              key={circle.id}
              css={{
                display: 'flex',
                flexDirection: 'row',
                gap: '$md',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={() => pickCircle(circle.id)}
            >
              <Text variant="sectionHeader">{circle.name}</Text>
            </Panel>
          ))}
        </Box>
      ))}
    </SingleColumnLayout>
  );
};

export default CirclesPage;
