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
    color: '$text',
    minWidth: 150,
    pt: `calc($sm + $xs)`,
    pr: '$lg',
    fontSize: '$h3',
    gap: '$sm',
    borderRadius: 0,
    fontWeight: '$medium',
    alignItems: 'center',
    borderTop: '5px solid transparent',
    '@xs': {
      minWidth: 0,
      p: '$xs $sm',
      gap: '$xxs',
      fontSize: '$xs',
      svg: {
        width: '$md',
        height: '$md',
      },
    },
    '&:hover': {
      borderColor: '$link',
      filter: 'brightness(1)',
      color: '$linkHover',
      outlineColor: 'transparent',
      textDecoration: 'none',
    },
  };
  const activeTabStyles = {
    borderColor: '$link',
    outlineColor: 'transparent',
    cursor: 'default',
    color: '$link',
  };
  return (
    <Flex css={{ gap: '$sm', mt: -3, mb: '$sm', zIndex: 2 }}>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.profileGive(targetAddress)}
        css={{
          ...tabStyles,
          ...(location.pathname.includes('give') && {
            ...activeTabStyles,
          }),
        }}
      >
        <GemCoOutline fa size="lg" /> GIVE
      </Button>
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.profilePosts(targetAddress)}
        css={{
          ...tabStyles,
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
        color="textOnly"
        to={coLinksPaths.profileNetwork(targetAddress)}
        css={{
          ...tabStyles,
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
        color="textOnly"
        to={coLinksPaths.profileReputation(targetAddress)}
        css={{
          ...tabStyles,
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
