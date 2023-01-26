import { useMemo, useState } from 'react';

import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import type { CSS } from 'stitches.config';

import { useMyProfile } from '../../recoilState';
import { LoadingModal } from 'components';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useToast } from 'hooks/useToast';
import { User } from 'icons/__generated';
import {
  paths,
  EXTERNAL_URL_GET_STARTED,
  EXTERNAL_URL_DISCORD,
} from 'routes/paths';
import { Box, Button, Flex, Image, Link, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { getOrgData, QUERY_KEY_MY_ORGS } from './getOrgData';
import { OrgCircles } from './OrgCircles';

import type { Awaited } from 'types/shim';
type QueryResult = Awaited<ReturnType<typeof getOrgData>>;
export type OrgWithCircles = QueryResult['organizations'][number];

export const CirclesPage = () => {
  const address = useConnectedAddress();
  const profile = useMyProfile();
  const { showDefault, showError, showSuccess } = useToast();
  const query = useQuery(
    [QUERY_KEY_MY_ORGS, address],
    () => getOrgData(address as string),
    {
      enabled: !!address,
      staleTime: Infinity,
    }
  );
  const orgs = query.data?.organizations;

  const [showAllCircles, setShowAllCircles] = useState(false);

  const Msg = () => (
    <Box role="dialog" tabIndex={0}>
      Lorem ipsum dolor
    </Box>
  );

  const displayMsg = () => {
    showSuccess(<Msg />);
    // toast(Msg) would also work
  };

  if (
    query.isLoading ||
    query.isIdle ||
    query.isRefetching ||
    orgs == undefined
  )
    return <LoadingModal visible note="CirclesPage" />;

  // Is there a sample org created by the current profile?
  const sampleOrg = orgs.find(
    o => o.sample && o.circles.length > 0 && o.created_by == profile.id
  );

  return (
    <SingleColumnLayout>
      <Flex
        row
        css={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: '$sm',
          '@sm': {
            flexDirection: 'column',
            alignItems: 'start',
          },
        }}
      >
        <Text h1 css={{ '@sm': { mb: '$sm' } }}>
          Overview
        </Text>

        <Box>
          <Button onClick={displayMsg} color="primary" pill>
            Error Multiline
          </Button>
          <Button onClick={displayMsg} color="primary" pill>
            Success Multiline
          </Button>
          <Button
            onClick={() => {
              showDefault(
                ' This is a long info message, but its really great because you are really great, really really. Yes you are Im so great too. Were all great. We neven need some more text. What kind of made up words can I create like globularus and the textimonisnyess'
              );
            }}
            color="primary"
          >
            Info Multiline
          </Button>
          <Button
            onClick={() => {
              showError('The file flowbite-figma-pro was permanently deleted.');
            }}
            color="primary"
          >
            Error
          </Button>
          <Button
            onClick={() => {
              showSuccess(
                'The action that you have done was a success! Well done'
              );
            }}
            color="primary"
          >
            Success
          </Button>
          <Button
            onClick={() => {
              showDefault('🦄 Wow so easy!');
            }}
            color="primary"
          >
            Info
          </Button>
        </Box>

        <Button as={NavLink} to={paths.createCircle} color="primary">
          Create New Circle
        </Button>
      </Flex>
      <Text
        p
        as="p"
        css={{ mb: '$lg', width: '50%', '@sm': { width: '100%' } }}
      >
        All your organizations and circles in one place.{' '}
        <Link
          onClick={() => {
            setShowAllCircles(prev => !prev);
          }}
          css={{ cursor: 'pointer' }}
          inlineLink
        >
          {!showAllCircles ? 'Show all circles' : 'Show only my circles'}
        </Link>
      </Text>
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
        ?.filter(o => !o.sample)
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

const buttons: [
  (circleId: number) => string,
  string,
  ((c: QueryCircle) => boolean)?
][] = [
  [paths.contributions, 'Contributions'],
  [paths.history, 'Epoch Overview'],
  [paths.give, 'Allocation'],
  [paths.map, 'Map'],
  [paths.members, 'Members'],
  [paths.circleAdmin, 'Admin', (c: QueryCircle) => c.users[0]?.role !== 1],
];

const nonMemberPanelCss: CSS = {
  backgroundColor: '$background',
  borderColor: '$borderMedium',
};

export type CircleRowProps = {
  circle: QueryCircle;
  onButtonClick: (id: number, path: string) => void;
  state?: string;
};
const GetStarted = () => {
  return (
    <>
      <Panel info>
        <Flex column css={{ width: '45%', '@sm': { width: '100%' } }}>
          <Text h2>Get Started</Text>
          <Text p as="p" css={{ mb: '$md', color: 'inherit' }}>
            An Organization houses all of your Circles in Coordinape. A Circle
            is equal to a team. Start a Circle, add members, then create an
            epoch.{' '}
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
              to={EXTERNAL_URL_GET_STARTED}
              target="_blank"
              color="secondary"
            >
              Get Started Guide
            </Button>
          </Flex>
        </Flex>
      </Panel>
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
      tabIndex={nonMember ? -1 : 0}
      key={circle.id}
      css={{
        display: 'flex',
        flexDirection: 'row',
        gap: '$md',
        border: '1px solid transparent',
        '.hover-buttons': { display: 'none', '@sm': { display: 'flex' } },
        '&:hover, &:focus-within': {
          '.hover-buttons': { display: 'flex' },
          '.circle-row-menu-indicator': { display: 'none' },
        },
        ...(nonMember ? nonMemberPanelCss : { cursor: 'pointer' }),
        transition: 'opacity 300ms ease-in-out',
        opacity:
          state === undefined || state === 'entering' || state === 'entered'
            ? 1
            : 0,
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
        <Flex column css={{ gap: '$sm' }}>
          <Text
            h3
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
            h3
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
                  color: '$borderMedium',
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
        {!nonMember && (
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
              {buttons.map(
                ([pathFn, label, hide]) =>
                  (!hide || !hide(circle)) && (
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
                  )
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Panel>
  );
};
