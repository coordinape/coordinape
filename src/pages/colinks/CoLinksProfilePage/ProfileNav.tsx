import { NavLink } from 'react-router-dom';

import {
  Bullseye,
  CertificateLight,
  GemCoFillSm,
  Write,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

export const tabStyles = {
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
  position: 'relative',
  zIndex: 1,
  cursor: 'pointer',
  '@md': {
    minWidth: 120,
    p: '$sm',
    gap: '$xs',
    fontSize: '$md',
  },
  '@sm': {
    flex: 1,
    minWidth: 60,
    p: '$sm',
    gap: '$xs',
    fontSize: '$small',
    borderWidth: '4px',
    flexDirection: 'column',
    mt: -1,
    svg: {
      margin: 0,
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
export const activeTabStyles = {
  borderColor: '$link',
  outlineColor: 'transparent',
  cursor: 'default',
  color: '$link',
};

export const navContainerStyles = {
  gap: '$sm',
  mt: -3,
  mb: '$sm',
  '@sm': {
    mb: 0,
    pb: 3,
    justifyContent: 'space-around',
    position: 'fixed',
    bottom: -3,
    left: 0,
    background: '$background',
    width: '100%',
    borderTop: '1px solid $borderDim',
    zIndex: 10,
  },
};
export const ProfileNav = ({ targetAddress }: { targetAddress: string }) => {
  return (
    <Flex
      css={{
        ...navContainerStyles,
      }}
    >
      <Button
        as={NavLink}
        color="textOnly"
        to={coLinksPaths.profileGive(targetAddress)}
        css={{
          ...tabStyles,
          ...(!location.pathname.substring(1).includes('/') && {
            ...activeTabStyles,
          }),
        }}
      >
        <GemCoFillSm fa size="lg" /> Profile
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
