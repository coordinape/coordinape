import { useMemo } from 'react';

import { isUserAdmin } from 'lib/users';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import type { CSS } from 'stitches.config';

import { OrgLogoUpload, LoadingModal } from 'components';
import { scrollToTop } from 'components/MainLayout/MainLayout';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { paths } from 'routes/paths';
import { Box, Button, Flex, Link, Panel, Text } from 'ui';
import { Torso } from 'ui/icons';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData } from './getOrgData';

import type { Awaited } from 'types/shim';
type QueryResult = Awaited<ReturnType<typeof getOrgData>>;

export const CirclesPage = () => {
  const navigate = useNavigate();
  const address = useConnectedAddress();
  const query = useQuery(
    ['myOrgs', address],
    () => getOrgData(address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );
  const orgs = query.data?.organizations;

  const goToCircle = (id: number, path: string) => {
    scrollToTop();
    navigate(path);
  };

  const isAdmin = (org: QueryResult['organizations'][0]) =>
    org.circles.map(c => c.users[0]).some(u => u && isUserAdmin(u));

  if (query.isLoading || query.isIdle || query.isRefetching)
    return <LoadingModal visible note="CirclesPage" />;

  return (
    <SingleColumnLayout>
      <Flex
        row
        css={{ justifyContent: 'space-between', alignItems: 'baseline' }}
      >
        <Text h1 css={{ mb: '$sm' }}>
          Overview
        </Text>
        <Button
          color="primary"
          outlined
          onClick={() => navigate(paths.createCircle)}
        >
          Create New Circle
        </Button>
      </Flex>
      <Text
        variant="p"
        as="p"
        css={{
          mb: '$lg',
          width: '50%',
          '@sm': { width: '100%' },
        }}
      >
        All your organizations and circles in one place.
      </Text>
      {orgs?.map(org => (
        <Box key={org.id} css={{ mb: '$lg' }}>
          <Flex row css={{ mb: '$md', alignItems: 'baseline' }}>
            <Box css={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
              <OrgLogoUpload
                id={org.id}
                original={org?.logo}
                isAdmin={isAdmin(org)}
                name={org.name}
              />
              <Text h2 css={{ ml: '$sm' }}>
                {org.name}
              </Text>
            </Box>
            {isAdmin(org) && (
              <Button
                color="primary"
                outlined
                onClick={() => navigate(paths.createCircle + '?org=' + org.id)}
              >
                Add Circle
              </Button>
            )}
          </Flex>
          <Box css={{ display: 'flex', flexDirection: 'column', gap: '$md' }}>
            {sortBy(org.circles, c => [-c.users.length, c.name]).map(circle => (
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

type QueryCircle = QueryResult['organizations'][0]['circles'][0];

const buttons: [
  (circleId: number) => string,
  string,
  ((c: QueryCircle) => boolean)?
][] = [
  [paths.history, 'History'],
  [paths.allocation, 'Allocation'],
  [paths.map, 'Map'],
  [paths.vouching, 'Vouching', (c: QueryCircle) => !c.vouching],
  [paths.members, 'Admin', (c: QueryCircle) => c.users[0]?.role !== 1],
];

const nonMemberPanelCss: CSS = {
  backgroundColor: 'white',
  border: '1px solid $border',
};

type CircleRowProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
};
const CircleRow = ({ circle, onButtonClick }: CircleRowProps) => {
  const role = circle.users[0]?.role;
  const nonMember = role === undefined;
  const nonMemberCss = nonMember ? { color: '$secondaryText' } : {};

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
        '.hover-buttons': {
          display: 'none',
          '@sm': { display: 'flex' },
        },
        '&:hover .hover-buttons': { display: 'flex' },
        ...(nonMember
          ? nonMemberPanelCss
          : {
              cursor: 'pointer',
            }),
      }}
      onClick={() =>
        !nonMember && onButtonClick(circle.id, paths.history(circle.id))
      }
    >
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 2.5fr',
          width: '100%',
          gap: '$md',
          alignItems: 'center',
          '@sm': { gridTemplateColumns: '1fr 1fr' },
        }}
      >
        <Box>
          <Text h2 css={{ mb: '$xs', ...nonMemberCss }}>
            {circle.name}
          </Text>
          <Text css={{ alignItems: 'baseline', ...nonMemberCss }}>
            <Torso
              css={{ height: 12, width: 12, mr: '$xs' }}
              color={role ? 'text' : 'secondaryText'}
            />
            {role === 1
              ? 'Circle Admin'
              : role === 0
              ? 'Circle Member'
              : 'Non-Member'}
          </Text>
        </Box>
        <Box
          css={{
            '@sm': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            },
          }}
        >
          {epoch && startDate && endDate ? (
            <>
              <Text css={{ fontSize: '$h3', ...nonMemberCss }}>
                Epoch {epoch.number}
              </Text>
              <Text css={{ fontSize: '$h3', ...nonMemberCss }} bold>
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
        <Box
          css={{
            '@sm': {
              gridColumnEnd: 'span 2',
              display: 'flex',
              justifyContent: 'space-around',
            },
            ...(nonMember ? { color: '$secondaryText' } : {}),
          }}
        >
          {!!nomineeCount && (
            <Box>
              {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
            </Box>
          )}
          {isCurrent && <Box>Allocation Period Open</Box>}
        </Box>
        {!nonMember && (
          <Box
            className="hover-buttons"
            css={{
              display: 'flex',
              gap: '$sm',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              '@sm': { gridColumnEnd: 'span 2', justifyContent: 'center' },
            }}
          >
            {buttons.map(
              ([pathFn, label, hide]) =>
                (!hide || !hide(circle)) && (
                  <Link
                    key={label}
                    css={{
                      padding: '$sm',
                      color: '$text',
                      fontWeight: '$semibold',
                      '&:hover': {
                        filter: 'brightness(0.2)',
                      },
                    }}
                    onClick={event => (
                      onButtonClick(circle.id, pathFn(circle.id)),
                      event.stopPropagation()
                    )}
                  >
                    {label}
                  </Link>
                )
            )}
          </Box>
        )}
      </Box>
    </Panel>
  );
};
