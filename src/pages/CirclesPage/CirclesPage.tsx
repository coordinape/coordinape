import { useEffect, useMemo } from 'react';

import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import type { CSS } from 'stitches.config';

import { useApiBase } from 'hooks';
import { useCurrentOrgId } from 'hooks/gql/useCurrentOrg';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Panel, Text } from 'ui';
import { Torso } from 'ui/icons';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData } from './getOrgData';

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
      {(query.isLoading || query.isIdle) && 'Loading...'}
      {orgs?.map(org => (
        <Box key={org.id} css={{ mb: '$lg' }}>
          <Box css={{ display: 'flex', mb: '$md' }}>
            <Text variant="sectionHeader" css={{ flexGrow: 1 }}>
              {org.name}
            </Text>
            <Button
              color="blue"
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

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;
type QueryCircle = QueryResult['organizations'][0]['circles'][0];

const buttons: [string, string, ((c: QueryCircle) => boolean)?][] = [
  [paths.history, 'History'],
  [paths.allocation, 'Allocation'],
  [paths.map, 'Map'],
  [paths.vouching, 'Vouching', (c: QueryCircle) => !c.vouching],
  [paths.adminCircles, 'Admin', (c: QueryCircle) => c.users[0]?.role !== 1],
];

const nonMemberPanelCss: CSS = {
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
  const nonMemberCss = nonMember ? { color: '$placeholder' } : {};

  const epoch = circle.epochs[0];
  const nomineeCount =
    circle.vouching && circle.nominees_aggregate.aggregate?.count;
  const [startDate, endDate] = useMemo(
    () =>
      epoch
        ? [DateTime.fromISO(epoch.start_date), DateTime.fromISO(epoch.end_date)]
        : [undefined, undefined],
    [epoch]
  );

  // this check is simple because the gql query filters out ended epochs
  const isCurrent = startDate && startDate < DateTime.now();

  return (
    <Panel
      key={circle.id}
      css={{
        display: 'flex',
        flexDirection: 'row',
        gap: '$md',
        '.hover-buttons': { visibility: 'hidden' },
        '&:hover .hover-buttons': { visibility: 'visible' },
        ...(nonMember ? nonMemberPanelCss : {}),
      }}
    >
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 2.5fr',
          width: '100%',
          gap: '$md',
          alignItems: 'center',
        }}
      >
        <Box>
          <Text variant="sectionHeader" css={{ mb: '$xs', ...nonMemberCss }}>
            {circle.name}
          </Text>
          <Text css={{ alignItems: 'baseline', ...nonMemberCss }}>
            <Torso
              css={{ height: 12, width: 12, mr: '$xs' }}
              color={
                role === 1 ? 'blue' : role === 0 ? 'primary' : 'placeholder'
              }
            />
            {role === 1 ? (
              <Text color="blue">Circle Admin</Text>
            ) : role === 0 ? (
              'Circle Member'
            ) : (
              'Non-Member'
            )}
          </Text>
        </Box>
        <Box>
          {epoch && startDate && endDate ? (
            <>
              <Text css={{ fontSize: '$7', ...nonMemberCss }}>
                Epoch {epoch.number}
              </Text>
              <Text css={{ fontSize: '$7', ...nonMemberCss }} bold>
                {startDate.toFormat('MMM d')} -{' '}
                {endDate.toFormat(
                  endDate.month === startDate.month ? 'd' : 'MMM d'
                )}
              </Text>
            </>
          ) : (
            'No active or upcoming epochs'
          )}
        </Box>
        <Box css={nonMember ? { color: '$placeholder' } : {}}>
          <Box>
            {!!nomineeCount &&
              `${nomineeCount} Nominee${nomineeCount > 1 ? 's' : ''}`}
          </Box>
          <Box>{isCurrent && 'Allocation Period Open'}</Box>
        </Box>
        <Box
          className="hover-buttons"
          css={{ display: 'flex', gap: '$sm', justifyContent: 'flex-start' }}
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
