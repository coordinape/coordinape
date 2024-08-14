import { NavLink } from 'react-router-dom';

import {
  Bullseye,
  CertificateLight,
  GemCoOutline,
  Write,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

export const ProfileNav = ({ targetAddress }: { targetAddress: string }) => {
  const tabStyles = {
    minWidth: 150,
    pr: '$lg',
    fontSize: '$h3',
    gap: '$sm',
    justifyContent: 'flex-start',
    fontWeight: '$medium',
    alignItems: 'center',
    background: 'transparent',
    backgroundSize: '400% 100%',
    backgroundPosition: '100% 50%',
    transition: 'background-position .5s',
    '&:hover': {
      filter: 'brightness(1)',
      backgroundPosition: '0 0',
      outlineColor: 'transparent',
    },
  };
  const activeTabStyles = {
    outlineColor: 'transparent',
    backgroundPosition: '0 0',
    cursor: 'default',
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
          ...tabStyles,
          background:
            'radial-gradient(circle at 25% 0%, rgb(231, 7, 222) 0%, rgb(246 106 23) 36%, transparent 66%)',
          ...(location.pathname.includes('posts') && {
            ...activeTabStyles,
          }),
        }}
      >
        <Write fa size="lg" />
        Posts
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
          ...tabStyles,
          background:
            'radial-gradient(circle at 25% 0%, rgb(89 0 255) 0%, rgb(255 185 14) 36%, transparent 66%)',
          ...(location.pathname.includes('network') && {
            ...activeTabStyles,
          }),
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
          ...tabStyles,
          background:
            'radial-gradient(circle at 25% 0%, rgb(19 236 119) 0%, rgb(94 7 231) 36%, transparent 66%)',
          ...(location.pathname.includes('give') && {
            ...activeTabStyles,
          }),
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
          ...tabStyles,
          background:
            'radial-gradient(circle at 25% 0%, rgb(7 90 231) 0%, rgb(236 19 129) 40%, transparent 66%)',
          ...(location.pathname.includes('reputation') && {
            ...activeTabStyles,
          }),
        }}
      >
        <CertificateLight fa size="lg" /> Reputation
      </Button>
    </Flex>
  );
};
