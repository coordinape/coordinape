/* eslint-disable no-console */
import { useContext, useState } from 'react';

import { ApolloError } from '@apollo/client';
import * as Sentry from '@sentry/react';
import { CoLogoMark } from 'features/nav/CoLogoMark';
import { cursor_ordering } from 'lib/gql/__generated__/zeus';
import { useTypedSubscription } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Menu, X } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { Flex, IconButton, Link, Text } from '../../ui';
import { NavLogo } from '../nav/NavLogo';
import {
  NOTIFICATIONS_QUERY_KEY,
  useNotificationCount,
} from '../notifications/useNotificationCount';
import isFeatureEnabled from 'config/features';

import { CoLinksContext } from './CoLinksContext';
import { CoLinksNavProfile } from './CoLinksNavProfile';
import { useCoLinksNavQuery } from './useCoLinksNavQuery';

export const CoLinksNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data } = useCoLinksNavQuery();
  const { address } = useContext(CoLinksContext);

  const queryClient = useQueryClient();
  const { profileId, last_read_notification_id } = useNotificationCount();

  // setup subscription hook for notifcation updates
  useTypedSubscription(
    {
      notifications_stream: [
        {
          batch_size: 20,
          where: {
            profile_id: { _eq: profileId },
            id: { _gt: last_read_notification_id },
          },
          cursor: [
            {
              initial_value: { id: last_read_notification_id },
              ordering: cursor_ordering.ASC,
            },
          ],
        },
        {
          id: true,
          reply: {
            id: true,
            reply: true,
          },
        },
      ],
    },
    {
      skip: !profileId || last_read_notification_id === undefined,
      // tODO:L handle zero casea for brand new users

      onData: () => {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      },
      onError: (error: ApolloError) => {
        Sentry.captureException(error);
        console.error(
          'Encountered an error fetching websocket subscription to activities stream',
          error
        );
      },
    }
  );

  return (
    <Flex
      column
      css={{
        flexGrow: 0,
        flexShrink: 0,
        background: '$navBackground',
        height: '100vh',
        position: 'static',
        p: '$xl $lg 0',
        flexDirection: 'column',
        width: '350px',
        transition: '.2s ease-in-out',
        '@lg': { width: '300px', p: '$lg $lg 0' },
        '@md': { width: '250px' },
        '@sm': {
          position: 'absolute',
          left: mobileMenuOpen ? '0' : '-100vw',
          width: '100vw',
          zIndex: 12,
          background: '$navBackground',
          pt: '$3xl',
          height: '100%',
        },
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '$md',
          mb: '$lg',
          button: { display: 'none' },
          position: 'relative',
          zIndex: '2',
          // gradient overlaying overflowing links
          '&::after': {
            content: '',
            position: 'absolute',
            background: 'linear-gradient($navBackground, transparent)',
            width: 'calc(100% + 6px)',
            height: '$2xl',
            bottom: '-$2xl',
            left: '-3px',
            pointerEvents: 'none',
            zIndex: '2',
            display: mobileMenuOpen ? 'block' : 'none',
          },
          '@lg': {
            mb: '$sm',
          },
          '@sm': {
            background: mobileMenuOpen ? '$surfaceNested' : '$navBackground',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            p: '$md $lg',
            height: '$3xl',
            button: { display: 'flex' },
          },
        }}
      >
        <Flex
          css={{
            gap: '$md',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <NavLogo />
          <Flex css={{ gap: '$sm' }}>
            <Text
              size="small"
              color="secondary"
              css={{
                fontStyle: 'italic',
                letterSpacing: '-0.2px',
                mr: '-2px',
              }}
            >
              by
            </Text>
            <CoLogoMark muted small mark />
          </Flex>
        </Flex>
        <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size="lg" /> : <Menu size="lg" />}
        </IconButton>
      </Flex>
      <Flex
        column
        css={{
          pt: '$sm',
          // So focus outlines don't get cropped
          mx: '-3px',
          px: '3px',
          // use enough pb for the scrolly gradient overlay
          pb: '$4xl',
          '@sm': {
            flex: 'initial',
            pt: '$lg',
            pb: '$lg',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          height: '100%',
          maxHeight: `calc(100vh - $3xl)`,
          overflow: 'auto',
          justifyItems: 'space-between',
        }}
      >
        <Flex
          css={{
            gap: '$xs',
            my: '$lg',
          }}
          column
        >
          <NavItem path={coLinksPaths.home}>Home</NavItem>
          <NavItem path={address ? coLinksPaths.profile(address) : ''}>
            Profile
          </NavItem>
          <NavItem path={address ? coLinksPaths.score(address) : ''}>
            Rep Score
          </NavItem>
          <NavItem path={coLinksPaths.notifications}>
            <Flex css={{ gap: '$md' }}>
              Notifications <Count />
            </Flex>
          </NavItem>
          <NavItem path={coLinksPaths.explore}>Explore</NavItem>
          <NavItem path={coLinksPaths.invites}>Invites</NavItem>
          {isFeatureEnabled('headlines') && (
            <NavItem path={coLinksPaths.headlines}>Breaking News</NavItem>
          )}
        </Flex>
      </Flex>
      <Flex column>
        {data && (
          <Flex
            css={{
              mt: '$sm',
              mb: '$lg',
              width: '100%',
              position: 'relative',
              // gradient overlaying overflowing links
              '&::after': {
                content: '',
                position: 'absolute',
                background: 'linear-gradient(transparent, $navBackground)',
                width: 'calc(100% + 6px)',
                height: '100px',
                top: '-103px',
                left: '-3px',
                pointerEvents: 'none',
                zIndex: '2',
              },
            }}
          >
            <CoLinksNavProfile
              name={data.profile.name}
              avatar={data.profile.avatar}
              hasCoSoul={!!data.profile.cosoul}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const NavItem = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isCurrentPage = location.pathname === path;
  return (
    <Link
      as={NavLink}
      to={path}
      css={{
        '&:hover': {
          background: '$surfaceNested',
        },
        color: isCurrentPage ? '$cta' : '$navLinkText',
        background: isCurrentPage ? '$surfaceNested' : 'transparent',
        p: '$sm $md',
        borderRadius: '$3',
      }}
    >
      {children}
    </Link>
  );
};

const Count = () => {
  const { count } = useNotificationCount();

  return count ? (
    <Text
      size="xs"
      semibold
      css={{
        borderRadius: 9999,
        backgroundColor: '$alert',
        color: 'white',
        p: '$xs',
        width: '20px',
        height: '20px',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {count}
    </Text>
  ) : null;
};
