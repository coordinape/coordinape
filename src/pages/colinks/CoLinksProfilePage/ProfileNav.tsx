import { useWindowSize } from '@react-hook/window-size';
import { NavLink } from 'react-router-dom';

import {
  Bullseye,
  CertificateLight,
  GemCoOutline,
  Grid,
  Write,
} from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Button } from 'ui';

import { cardColumnMinWidth } from './ProfileCards';

export const ProfileNav = ({ targetAddress }: { targetAddress: string }) => {
  const [width] = useWindowSize();
  const showOverviewTab = width < cardColumnMinWidth;
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
    position: 'relative',
    zIndex: 2,
    cursor: 'pointer',
    '@md': {
      minWidth: 120,
      p: '$sm',
      gap: '$xs',
      fontSize: '$md',
    },
    '@sm': {
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
  const activeTabStyles = {
    borderColor: '$link',
    outlineColor: 'transparent',
    cursor: 'default',
    color: '$link',
  };
  return (
    <Flex
      css={{
        gap: '$sm',
        mt: -3,
        mb: '$sm',
        '@sm': {
          mb: 0,
          pb: 3,
          justifyContent: 'space-between',
          position: 'fixed',
          bottom: -3,
          left: 0,
          background: '$background',
          width: '100%',
          borderTop: '1px solid $borderDim',
          zIndex: 10,
        },
      }}
    >
      {showOverviewTab && (
        <Button
          as={NavLink}
          color="textOnly"
          to={coLinksPaths.profileOverview(targetAddress)}
          css={{
            ...tabStyles,
            ...(location.pathname.includes('overview') && {
              ...activeTabStyles,
            }),
          }}
        >
          <Grid size="lg" /> About
        </Button>
      )}
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
