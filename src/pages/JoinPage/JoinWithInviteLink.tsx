import assert from 'assert';
import { useState } from 'react';

import uniqBy from 'lodash/uniqBy';
import zip from 'lodash/zip';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import type { TokenJoinInfo } from '../../../api/join/[token]';
import { LoadingModal } from '../../components';
import CircleWithLogo, { Admins } from '../../components/CircleWithLogo';
import { givePaths } from '../../routes/paths';
import { Avatar, Box, Button, CenteredBox, Flex, Panel, Text } from 'ui';

import { JoinForm } from './JoinForm';

export const JoinWithInviteLink = ({
  tokenJoinInfo,
  profile,
}: {
  tokenJoinInfo: TokenJoinInfo;
  profile?: { name?: string };
}) => {
  const { circle, organization: org, token } = tokenJoinInfo;

  if (circle) return <JoinCircle {...{ circle, profile, token }} />;
  assert(org);
  return <JoinOrg {...{ org, profile, token }} />;
};

const JoinCircle = ({
  circle,
  profile,
  token,
}: {
  circle: NonNullable<TokenJoinInfo['circle']>;
  profile?: { name?: string };
  token: string;
}) => {
  const { organization, admins } = circle;

  return (
    <CenteredBox css={{ gap: '$md' }}>
      <Text h2 inline bold color="neutral">
        Join this circle on Coordinape
      </Text>

      <Panel nested>
        <CircleWithLogo
          logo={circle.logo}
          name={circle.name}
          orgName={organization.name}
          orgLogo={organization.logo}
          admins={admins.map(u => u.profile)}
        />
      </Panel>
      <Box>
        <Text css={{ justifyContent: 'center' }}>
          You&apos;ve been invited to join the {circle.name} Circle at{' '}
          {organization.name}!
        </Text>
      </Box>
      <CTA
        loggedIn={!!profile}
        redirectTo={givePaths.circle(circle.id)}
        token={token}
      />
    </CenteredBox>
  );
};

const JoinOrg = ({
  org,
  profile,
  token,
}: {
  org: NonNullable<TokenJoinInfo['organization']>;
  profile?: { name?: string };
  token: string;
}) => {
  // in the query, we select a max of 3 admins from each circle, but what we
  // want here is a max of 3 admins total.
  // zip (https://devdocs.io/lodash~4/index#zip) is used here to pick one admin
  // from each circle instead of 3 admins from the first circle
  const admins = uniqBy(
    zip(...org.circles.map(c => c.admins.map(u => u.profile))).flat(),
    'name'
  )
    .filter(x => x)
    .slice(0, 3) as { name: string; avatar?: string }[];

  return (
    <CenteredBox css={{ gap: '$md' }}>
      <Text h2 bold color="neutral">
        Join this organization on Coordinape
      </Text>
      <Panel nested>
        <Flex css={{ flexDirection: 'row', gap: '$md' }}>
          <Avatar
            path={org.logo}
            name={org.name}
            css={{ alignSelf: 'center' }}
          />
          <Text semibold>{org.name}</Text>
          {admins && admins.length > 0 && <Admins {...{ admins }} />}
        </Flex>
      </Panel>
      <Text css={{ justifyContent: 'center' }}>
        You&apos;ve been invited to join {org.name}!
      </Text>
      <CTA
        loggedIn={!!profile}
        redirectTo={givePaths.organization(org.id)}
        token={token}
      />
    </CenteredBox>
  );
};

const CTA = ({
  loggedIn,
  token,
  redirectTo,
}: {
  loggedIn: boolean;
  token: string;
  redirectTo: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();

  return (
    <Box>
      {loading && <LoadingModal visible={true} />}
      {loggedIn ? (
        <JoinForm
          token={token}
          redirectTo={redirectTo}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${location.pathname}`}
          size="large"
          color="primary"
        >
          Accept Invite
        </Button>
      )}
    </Box>
  );
};
