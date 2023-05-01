import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from 'features/auth';
import { Role } from 'lib/users';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import type { CSS } from 'stitches.config';

import { LoadingModal } from 'components';
import HintBanner from 'components/HintBanner';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { User } from 'icons/__generated';
import {
  EXTERNAL_URL_DISCORD,
  EXTERNAL_URL_GET_STARTED,
  paths,
} from 'routes/paths';
import { Box, Button, ContentHeader, Flex, Image, Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData, QUERY_KEY_MY_ORGS } from './getOrgData';
import { OrgCircles } from './OrgCircles';

import type { Awaited } from 'types/shim';

type QueryResult = Awaited<ReturnType<typeof getOrgData>>;
export type OrgWithCircles = QueryResult['organizations'][number];

export const CirclesPage = () => {
  const address = useConnectedAddress();
  const profileId = useAuthStore(state => state.profileId);
  const query = useQuery(
    [QUERY_KEY_MY_ORGS, address],
    () => getOrgData(address as string),
    { enabled: !!address, staleTime: Infinity }
  );
  const orgs = query.data?.organizations;

  const [showAllCircles, setShowAllCircles] = useState(false);
  const [sampleOrg, setSampleOrg] = useState<OrgWithCircles | undefined>(
    undefined
  );
  const [circleMembershipCount, setCircleMembershipCount] = useState(0);
  useEffect(() => {
    if (orgs) {
      setSampleOrg(
        orgs.find(
          o => o.sample && o.circles.length > 0 && o.created_by == profileId
        )
      );
      let counter = 0;
      orgs.forEach(o => {
        o.circles.forEach(c => {
          const role = c.users[0]?.role;
          if (role !== undefined) {
            counter += 1;
          }
        });
      });
      setCircleMembershipCount(counter);
      if (counter == 0) setShowAllCircles(true);
    }
  }, [orgs]);

  if (
    query.isLoading ||
    query.isIdle ||
    query.isRefetching ||
    orgs == undefined
  )
    return <LoadingModal visible note="CirclesPage" />;

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Overview</Text>
          <Text p as="p">
            All your organizations and circles in one place.{' '}
            {circleMembershipCount > 0 && (
              <Link
                onClick={() => {
                  setShowAllCircles(prev => !prev);
                }}
                css={{ cursor: 'pointer' }}
                inlineLink
              >
                {!showAllCircles ? 'Show all circles' : 'Show only my circles'}
              </Link>
            )}
          </Text>
        </Flex>
        <Button as={NavLink} to={paths.createCircle} color="cta">
          Create New Circle
        </Button>
      </ContentHeader>

      {/* Show the sample org first*/}
      {/* Do we have a sample already? If not, lets offer to make one eh */}
      {sampleOrg && (
        <OrgCircles
          key={sampleOrg.id}
          org={sampleOrg}
          showAllCircles={showAllCircles}
        />
      )}
      {/* Show the non-sample orgs*/}
      {orgs
        ?.filter(o => !(o.sample && o.created_by == profileId))
        .map(org => (
          <OrgCircles key={org.id} org={org} showAllCircles={showAllCircles} />
        ))}
      {/* Get Started help! */}
      {(orgs.length == 0 || (orgs.length == 1 && sampleOrg)) && <GetStarted />}
    </SingleColumnLayout>
  );
};

export default CirclesPage;

type QueryCircle = QueryResult['organizations'][0]['circles'][0];

const buttons = (
  circle: QueryCircle
): [(circleId: number) => string, string][] => {
  if (circle.users.length === 0) return [[paths.members, 'Members']];

  const b: [(circleId: number) => string, string][] = [
    [paths.contributions, 'Contributions'],
    [paths.epochs, 'Epoch Overview'],
    [paths.give, 'Allocation'],
    [(id: number) => paths.map(id), 'Map'],
    [paths.members, 'Members'],
  ];

  if (circle.users[0]?.role === Role.ADMIN)
    b.push([paths.circleAdmin, 'Admin']);

  return b;
};

const nonMemberPanelCss: CSS = {
  backgroundColor: '$background',
  borderColor: '$borderContrast',
};

export type CircleRowProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
  state?: string;
};

const GetStarted = () => {
  return (
    <>
      <HintBanner title={'Get Started'}>
        <Text p as="p" css={{ color: 'inherit' }}>
          An Organization houses all of your Circles in Coordinape. A Circle is
          equal to a team. Start a Circle, add members, then create an epoch.{' '}
          <Link inlineLink href={EXTERNAL_URL_DISCORD} target="_blank">
            Join our discord
          </Link>{' '}
          where we&apos;re always happy to help and keep you updated on whats
          happening.
        </Text>
        <Flex css={{ gap: '$md' }}>
          <Button as={NavLink} to={paths.createCircle} color="cta">
            Create New Circle
          </Button>
          <Button
            as={NavLink}
            to={`//${EXTERNAL_URL_GET_STARTED}`}
            target="_blank"
            color="secondary"
          >
            Get Started Guide
          </Button>
        </Flex>
      </HintBanner>
      <Image
        alt="Illustration of circle allocations"
        css={{ mt: '$3xl', mx: 'auto', width: '100%', maxWidth: '600px' }}
        src="/imgs/background/circles-illustration.png"
      />
    </>
  );
};

const epochDescription = (epoch: QueryCircle['epochs'][number]) => {
  if (epoch.description) return epoch.description;
  else {
    if (epoch.number !== null) return `Epoch ${epoch.number}`;
    else {
      if (DateTime.fromISO(epoch.start_date) > DateTime.now())
        return 'Upcoming Epoch';
      else return '';
    }
  }
};

export const CircleRow = ({ circle, onButtonClick, state }: CircleRowProps) => {
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
      tabIndex={nonMember ? -1 : 0}
      key={circle.id}
      css={{
        display: 'flex',
        flexDirection: 'row',
        gap: '$md',
        minHeight: '5.7rem',
        border: '1px solid transparent',
        '.hover-buttons': { display: 'none', '@sm': { display: 'flex' } },
        '&:hover, &:focus-within': {
          '.hover-buttons': { display: 'flex' },
          '.circle-row-menu-indicator': { display: 'none' },
        },
        cursor: 'pointer',
        ...(nonMember ? nonMemberPanelCss : {}),
        transition: 'opacity 300ms ease-in-out',
        opacity:
          state === undefined || state === 'entering' || state === 'entered'
            ? 1
            : 0,
      }}
      onClick={() =>
        !nonMember && onButtonClick(circle.id, paths.epochs(circle.id))
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
        <Flex column css={{ gap: '$sm' }}>
          <Text
            large
            semibold
            css={{
              minHeight: '$lg',
              alignItems: 'start',
              '@sm': { fontSize: '$large', minHeight: '$xl' },
              ...nonMemberCss,
            }}
          >
            {circle.name}
          </Text>
          <Text color="neutral" size="small" css={{ ...nonMemberCss }}>
            <User size="sm" css={{ mr: '$xs' }} />
            {role === 1
              ? 'Circle Admin'
              : role === 0
              ? 'Circle Member'
              : 'Non Member'}
          </Text>
        </Flex>
        <Flex column css={{ gap: '$sm' }}>
          <Text
            large
            css={{
              minHeight: '$lg',
              alignItems: 'end',
              '@sm': { fontSize: '$medium', minHeight: '$xl' },
            }}
          >
            {epoch && startDate && endDate ? (
              <Flex
                css={{
                  gap: '$md',
                  '@sm': { flexDirection: 'column', gap: '$sm' },
                }}
              >
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
                <Text
                  size="small"
                  css={{
                    color: '$headingText',
                    ...nonMemberCss,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isCurrent && <span>Allocation Period Open</span>}
                </Text>
                {!!nomineeCount && (
                  <Text
                    size="small"
                    css={{
                      color: '$headingText',
                      ...nonMemberCss,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
                  </Text>
                )}
              </Flex>
            ) : (
              <Text
                css={{
                  fontSize: '$medium',
                  color: '$secondaryText',
                  '@sm': { fontSize: '$small' },
                  ...nonMemberCss,
                }}
              >
                No active or upcoming epochs
              </Text>
            )}
          </Text>
          {epoch && startDate && endDate && (
            <Text>{epochDescription(epoch)}</Text>
          )}
        </Flex>
        <Box
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: '100%',
            '@sm': { gridColumnEnd: 'span 2' },
          }}
        >
          <Box
            className="circle-row-menu-indicator"
            css={{ '@sm': { display: 'none' } }}
          >
            <Text color="neutral" size="large">
              &middot;&middot;&middot;
            </Text>
          </Box>
          <Box
            className="hover-buttons"
            css={{
              display: 'flex',
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
            {buttons(circle).map(([pathFn, label]) => (
              <Button
                key={label}
                tabIndex={0}
                color="secondary"
                size="tag"
                css={{ border: 'none' }}
                as={NavLink}
                to={pathFn(circle.id)}
                onClick={(event: { stopPropagation: () => any }) =>
                  event.stopPropagation()
                }
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Panel>
  );
};
