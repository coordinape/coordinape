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
import { Torso } from 'icons';
import {
  paths,
  EXTERNAL_URL_GET_STARTED,
  EXTERNAL_URL_DISCORD,
} from 'routes/paths';
import { Box, Button, Flex, Image, Link, Panel, Text } from 'ui';
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

  // if (orgs?.length == 0) return <GetStarted />;

  return (
    <SingleColumnLayout>
      <Flex
        row
        css={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '$sm',
          '@sm': {
            flexDirection: 'column',
            alignItems: 'start',
          },
        }}
      >
        <Text h1 css={{ mb: '$sm' }}>
          Overview
        </Text>
        <Link href={paths.createCircle}>
          <Button color="primary" outlined>
            Create New Circle
          </Button>
        </Link>
      </Flex>
      <Text
        p
        as="p"
        css={{
          mb: '$lg',
          width: '50%',
          '@sm': { width: '100%' },
        }}
      >
        All your organizations and circles in one place.
      </Text>
      {orgs?.length == 0 && <GetStarted />}
      {orgs?.map(org => (
        <Box key={org.id} css={{ mb: '$lg' }}>
          <Flex row css={{ mb: '$lg', alignItems: 'baseline' }}>
            <Box css={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
              <OrgLogoUpload
                id={org.id}
                original={org?.logo}
                isAdmin={isAdmin(org)}
                name={org.name}
              />
              <Text
                h2
                medium
                css={{
                  ml: '$sm',
                  '@sm': {
                    fontSize: '$large',
                  },
                }}
              >
                {org.name}
              </Text>
            </Box>
            {isAdmin(org) && (
              <Link href={paths.createCircle + '?org=' + org.id}>
                <Button
                  color="primary"
                  outlined
                  css={{ whiteSpace: 'nowrap', ml: '$sm' }}
                >
                  Add Circle
                </Button>
              </Link>
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
  backgroundColor: '$background',
  border: '1px solid $borderMedium',
};

type CircleRowProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
};
const GetStarted = () => {
  return (
    <>
      <Panel
        info
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '$md',
          '@sm': { gridTemplateColumns: '1fr' },
        }}
      >
        <Box>
          <Text h2 normal>
            Get Started
          </Text>
        </Box>
        <Flex
          column
          css={{
            width: '65%',
            '@sm': { width: '100%' },
          }}
        >
          <Text p as="p" css={{ mb: '$md' }}>
            An Organization houses all of your Circles in Coordinape. A Circle
            is equal to a team. Start a Circle, add members, then create an
            epoch.{' '}
            <Link href={EXTERNAL_URL_DISCORD} target="_blank">
              Join our discord
            </Link>{' '}
            where we&apos;re always happy to help and keep you updated on whats
            happening.
          </Text>
          <Box>
            <Link href={paths.createCircle}>
              <Button color="primary" outlined inline css={{ mr: '$md' }}>
                Create New Circle
              </Button>
            </Link>
            <Link href={EXTERNAL_URL_GET_STARTED} target="_blank">
              <Button color="primary" outlined inline css={{ mt: '$md' }}>
                Get Started Guide
              </Button>
            </Link>
          </Box>
        </Flex>
      </Panel>
      <Image
        alt="Illustration of circle allocations"
        css={{
          mt: '$3xl',
          mx: 'auto',
          width: '100%',
          maxWidth: '600px',
        }}
        src="/imgs/background/circles-illustration.jpg"
      />
    </>
  );
};
const CircleRow = ({ circle, onButtonClick }: CircleRowProps) => {
  const role = circle.users[0]?.role;
  const nonMember = role === undefined;
  const nonMemberCss = nonMember ? { color: '$borderMedium' } : {};

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
        '&:hover': {
          '.hover-buttons': { display: 'flex' },
          '.circle-row-menu-indicator': { display: 'none' },
        },
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
          gridTemplateColumns: '1fr 1.5fr 2.5fr',
          width: '100%',
          gap: '$md',
          alignItems: 'start',
          '@sm': { gridTemplateColumns: '1fr 1fr' },
        }}
      >
        <Box>
          <Text
            h3
            semibold
            css={{
              mb: '$sm',
              minHeight: '$lg',
              alignItems: 'start',
              '@sm': {
                fontSize: '$large',
              },
              ...nonMemberCss,
            }}
          >
            {circle.name}
          </Text>
          <Text color={'neutral'} size={'small'} css={{ ...nonMemberCss }}>
            <Torso size={'md'} css={{ mr: '$xs' }} />
            {role === 1
              ? 'Circle Admin'
              : role === 0
              ? 'Circle Member'
              : 'Non Member'}
          </Text>
        </Box>
        <Box
          css={{
            '@sm': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            },
          }}
        >
          <Text
            h3
            css={{
              mb: '$sm',
              minHeight: '$lg',
              alignItems: 'end',
              '@sm': {
                fontSize: '$medium',
              },
            }}
          >
            {epoch && startDate && endDate ? (
              <>
                <Text
                  inline
                  css={{ pr: '$xs', color: '$headingText', ...nonMemberCss }}
                >
                  Epoch {epoch.number}
                  <Text
                    inline
                    semibold
                    color={'default'}
                    css={{ whiteSpace: 'nowrap' }}
                  >
                    {startDate.toFormat('MMM d')} -{' '}
                    {endDate.toFormat(
                      endDate.month === startDate.month ? 'd' : 'MMM d'
                    )}
                  </Text>
                </Text>
              </>
            ) : (
              <Text
                size={'medium'}
                css={{
                  color: '$headingText',
                  '@sm': {
                    fontSize: '$small',
                  },
                  ...nonMemberCss,
                }}
              >
                No active or upcoming epochs
              </Text>
            )}
          </Text>
          <Text size={'small'} css={{ color: '$headingText', ...nonMemberCss }}>
            {!!nomineeCount && (
              <span>
                {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
              </span>
            )}
            {isCurrent && <span>Allocation Period Open</span>}
            &nbsp;
          </Text>
        </Box>
        {!nonMember && (
          <Box
            css={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Box
              className="circle-row-menu-indicator"
              css={{
                '@sm': { display: 'none' },
              }}
            >
              <Text color="neutral" size="large">
                &middot;&middot;&middot;
              </Text>
            </Box>
            <Box
              className="hover-buttons"
              css={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                gap: '$sm',
                mr: '-$sm',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                '@sm': {
                  gap: '$xs',
                  mr: '-$xs',
                  gridColumnEnd: 'span 2',
                  justifyContent: 'end',
                },
              }}
            >
              {buttons.map(
                ([pathFn, label, hide]) =>
                  (!hide || !hide(circle)) && (
                    <Link href={pathFn(circle.id)}>
                      <Button
                        color="neutral"
                        outlined
                        size="small"
                        key={label}
                        css={{
                          border: 'none',
                          fontWeight: '$semibold',
                        }}
                      >
                        {label}
                      </Button>
                    </Link>
                  )
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Panel>
  );
};
