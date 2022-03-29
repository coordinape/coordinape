// TODO
// add current epoch
// add vouching/distribution
// scroll back to top when clicking into a circle
// pre-populate org name when clicking Add Circle

import { useEffect } from 'react';

import { order_by } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import type { CSS } from 'stitches.config';

import { useApiBase } from 'hooks';
import { useCurrentOrgId } from 'hooks/gql/useCurrentOrg';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import type { Awaited } from 'types/shim';

export const CirclesPage = () => {
  const navigate = useNavigate();
  const { selectAndFetchCircle } = useApiBase();

  const [currentOrgId, setCurrentOrgId] = useCurrentOrgId();
  const address = useConnectedAddress();
  const query = useQuery(['myOrgs', address], () => getOrgData(address), {
    enabled: !!address,
  });
  const orgs = query.data?.organizations;

  useEffect(() => {
    if (orgs && !currentOrgId) {
      setCurrentOrgId(orgs[0].id);
    }
  }, [orgs]);

  const goToCircle = (id: number, path: string) => {
    setCurrentOrgId(orgs?.find(o => o.circles.some(c => c.id === id))?.id);
    selectAndFetchCircle(id).then(() => navigate(path));
  };

  return (
    <SingleColumnLayout>
      {query.isLoading || (query.isIdle && 'Loading...')}
      {orgs?.map(org => (
        <Box key={org.id} css={{ mb: '$lg' }}>
          <Box css={{ display: 'flex' }}>
            <Text variant="sectionHeader" css={{ mb: '$md', flexGrow: 1 }}>
              {org.name}
            </Text>
            <Button
              color="blue"
              size="small"
              outlined
              onClick={() => navigate(paths.createCircle)}
            >
              Add Circle
            </Button>
          </Box>
          <Box css={{ display: 'flex', flexDirection: 'column', gap: '$md' }}>
            {org.circles.map(circle => (
              <CircleRow
                circle={circle}
                key={circle.id}
                onButtonClick={goToCircle}
              />
            ))}
          </Box>
        </Box>
      ))}
    </SingleColumnLayout>
  );
};

export default CirclesPage;

const getOrgData = (address?: string) =>
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
            epochs: [
              {
                where: { ended: { _eq: false } },
                limit: 1,
                order_by: [{ start_date: order_by.asc }],
              },
              { start_date: true, end_date: true },
            ],
          },
        ],
      },
    ],
  });

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;
type QueryCircle = QueryResult['organizations'][0]['circles'][0];

const buttons: [string, string, ((c: QueryCircle) => boolean)?][] = [
  [paths.history, 'History'],
  [paths.allocation, 'Allocation'],
  [paths.map, 'Map'],
  [paths.vouching, 'Vouching', (c: QueryCircle) => !c.vouching],
  [paths.adminCircles, 'Admin', (c: QueryCircle) => c.users[0]?.role !== 1],
];

const nonMemberCss: CSS = {
  backgroundColor: 'white',
  border: '1px solid $lightGray',
  '.hover-buttons': { display: 'none' },
};

type CircleRowProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
};
const CircleRow = ({ circle, onButtonClick }: CircleRowProps) => {
  const role = circle.users[0]?.role;
  const nonMember = role === undefined;

  return (
    <Panel
      key={circle.id}
      css={{
        display: 'flex',
        flexDirection: 'row',
        gap: '$md',
        '.hover-buttons': { visibility: 'hidden' },
        '&:hover .hover-buttons': { visibility: 'visible' },
        ...(nonMember ? nonMemberCss : {}),
      }}
    >
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 3fr',
          width: '100%',
          gap: '$md',
          alignItems: 'center',
        }}
      >
        <Box>
          <Text
            variant="sectionHeader"
            css={{ mb: '$xs', ...(nonMember ? { color: '$placeholder' } : {}) }}
          >
            {circle.name}
          </Text>
          <Text css={nonMember ? { color: '$placeholder' } : {}}>
            {role === 1
              ? 'Circle Admin'
              : role === 0
              ? 'Circle Member'
              : 'Non-Member'}
          </Text>
        </Box>
        <Box>Epoch ???</Box>
        <Box>Something</Box>
        <Box
          className="hover-buttons"
          css={{
            display: 'flex',
            gap: '$md',
            justifyContent: 'flex-start',
          }}
        >
          {buttons.map(
            ([path, label, hide]) =>
              (!hide || !hide(circle)) && (
                <Button
                  key={label}
                  outlined
                  color="teal"
                  onClick={() => onButtonClick(circle.id, path)}
                >
                  {label}
                </Button>
              )
          )}
        </Box>
      </Box>
    </Panel>
  );
};
