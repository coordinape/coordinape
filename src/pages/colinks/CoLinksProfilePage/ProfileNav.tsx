import { NavLink } from 'react-router-dom';

import {
  Bullseye,
  CertificateLight,
  GemCoOutline,
  Write,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button, Text } from 'ui';

export const ProfileNav = ({ targetAddress }: { targetAddress: string }) => {
  const buttonStyles = {
    minWidth: 150,
    pr: '$lg',
    fontSize: '$h3',
    gap: '$sm',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };
  return (
    <Flex css={{ gap: '$sm' }}>
      <Button
        as={NavLink}
        to={coLinksPaths.profilePosts(targetAddress)}
        color={
          location.pathname.includes('posts')
            ? 'selectedSecondary'
            : 'secondary'
        }
        css={{
          ...buttonStyles,
        }}
      >
        <Write fa size="lg" />
        <Text>Posts</Text>
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileNetwork(targetAddress)}
        color={
          location.pathname.includes('network')
            ? 'selectedSecondary'
            : 'secondary'
        }
        css={{
          ...buttonStyles,
          // background: location.pathname.includes('network')
          //   ? 'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)'
          //   : 'transparent',
        }}
      >
        <Bullseye fa size="lg" />
        Network
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileGive(targetAddress)}
        color={
          location.pathname.includes('give') ? 'selectedSecondary' : 'secondary'
        }
        css={{
          ...buttonStyles,
        }}
      >
        <GemCoOutline fa size="lg" /> GIVE
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileReputation(targetAddress)}
        color={
          location.pathname.includes('reputation')
            ? 'selectedSecondary'
            : 'secondary'
        }
        css={{
          ...buttonStyles,
        }}
      >
        <CertificateLight fa size="lg" /> Reputation
      </Button>
    </Flex>
  );
};
