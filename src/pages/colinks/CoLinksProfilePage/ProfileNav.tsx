import { NavLink } from 'react-router-dom';

import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

export const ProfileNav = ({ targetAddress }: { targetAddress: string }) => {
  return (
    <Flex css={{ gap: '$sm' }}>
      <Button
        as={NavLink}
        to={coLinksPaths.profilePosts(targetAddress)}
        size="xs"
        color={
          location.pathname.includes('posts')
            ? 'selectedSecondary'
            : 'secondary'
        }
      >
        Posts
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileNetwork(targetAddress)}
        size="xs"
        color={
          location.pathname.includes('network')
            ? 'selectedSecondary'
            : 'secondary'
        }
      >
        Network
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileGive(targetAddress)}
        size="xs"
        color={
          location.pathname.includes('give') ? 'selectedSecondary' : 'secondary'
        }
      >
        GIVE
      </Button>
      <Button
        as={NavLink}
        to={coLinksPaths.profileReputation(targetAddress)}
        size="xs"
        color={
          location.pathname.includes('reputation')
            ? 'selectedSecondary'
            : 'secondary'
        }
      >
        Reputation
      </Button>
    </Flex>
  );
};
