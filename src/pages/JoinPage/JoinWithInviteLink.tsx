import { useState } from 'react';

import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import type { TokenJoinInfo } from '../../../api/circle/landing/[token]';
import { LoadingModal } from '../../components';
import CircleWithLogo from '../../components/CircleWithLogo';
import { Box, Button, CenteredBox, Panel, Text } from '../../ui';

import { JoinForm } from './JoinForm';

export const JoinWithInviteLink = ({
  tokenJoinInfo,
  profile,
}: {
  tokenJoinInfo: TokenJoinInfo;
  profile?: { name?: string };
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const {
    circle,
    circle: { organization, users },
  } = tokenJoinInfo;

  return (
    <CenteredBox>
      {loading && <LoadingModal visible={true} />}
      <Panel nested>
        <CircleWithLogo
          logo={circle.logo}
          name={circle.name}
          orgName={organization.name}
          orgLogo={organization.logo}
          admins={users.map(u => ({
            name: u.profile.name,
            avatar: u.profile.avatar,
          }))}
        />
      </Panel>
      <Box css={{ textAlign: 'center', mt: '$3xl', mb: '$xl' }}>
        <Text h2 inline bold color="neutral">
          Join the {circle.name} Circle
        </Text>
      </Box>
      <Box>
        <Text
          css={{
            justifyContent: 'center',
          }}
        >
          You&apos;ve been invited to join the {circle.name} Circle at{' '}
          {organization.name}!
        </Text>
      </Box>
      {profile ? (
        <JoinForm
          tokenJoinInfo={tokenJoinInfo}
          loading={loading}
          setLoading={setLoading}
        />
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${location.pathname}`}
          css={{ mt: '$md' }}
          size="large"
          color="primary"
        >
          Connect Wallet
        </Button>
      )}
    </CenteredBox>
  );
};
