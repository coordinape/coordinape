/* eslint-disable no-console */
import { useContext, useEffect, useState } from 'react';

import { CoLogoMark } from 'features/nav/CoLogoMark';
import { useLocation } from 'react-router';
import { NavLink, useNavigate } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import { Flex, HR, IconButton, Link, Text } from '../../ui';
import { NavLogo } from '../nav/NavLogo';
import { useNotificationCount } from '../notifications/useNotificationCount';
import { SearchBox } from '../SearchBox/SearchBox';
import {
  Ai,
  BoltFill,
  CertificateFill,
  HouseFill,
  Menu,
  PaperPlane,
  PlanetFill,
  Settings,
  UserFill,
  X,
} from 'icons/__generated';

import { CoLinksContext } from './CoLinksContext';
import { CoLinksNavProfile } from './CoLinksNavProfile';
import { useCoLinksNavQuery } from './useCoLinksNavQuery';

export const CoLinksNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data } = useCoLinksNavQuery();
  const { address } = useContext(CoLinksContext);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
          zIndex: 13,
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
            width: '100%',
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
            '@sm': {
              justifyContent: 'flex-start',
            },
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
          justifyItems: 'space-between',
          '@media screen and (max-height: 800px)': {
            overflow: 'auto',
          },
        }}
      >
        <Flex
          css={{
            gap: '$xs',
            // my: '$lg',
            mx: '-$sm',
            // clip overflow protection
            px: '5px',
          }}
          column
        >
          <Flex css={{ mb: '$lg' }}>
            <SearchBox />
          </Flex>
          <NavItem path={coLinksPaths.home}>
            <HouseFill size="lg" nostroke />
            Home
          </NavItem>
          <NavItem path={coLinksPaths.explore}>
            <PlanetFill size="lg" nostroke />
            Explore
          </NavItem>
          <NavItem path={coLinksPaths.notifications}>
            <BoltFill size="lg" nostroke />
            <Flex css={{ gap: '$md' }}>
              Notifications <Count />
            </Flex>
          </NavItem>
          <NavItem path={coLinksPaths.highlights}>
            <Ai size="lg" nostroke />
            Highlights
          </NavItem>
          <HR />
          <NavItem path={address ? coLinksPaths.profile(address) : ''}>
            <Flex
              css={{
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Flex css={{ gap: '$md' }}>
                <UserFill size="lg" nostroke />
                Profile
              </Flex>
              <IconButton
                css={{
                  fontSize: '$small',
                  color: '$secondaryText',
                  '&:hover': {
                    color: '$linkHover',
                  },
                }}
                onClick={e => {
                  e.preventDefault();
                  navigate(coLinksPaths.account);
                }}
              >
                <Settings css={{ path: { fill: 'transparent !important' } }} />
              </IconButton>
            </Flex>
          </NavItem>
          <NavItem path={address ? coLinksPaths.score(address) : ''}>
            <CertificateFill size="lg" nostroke />
            Rep Score
          </NavItem>
          <NavItem path={coLinksPaths.invites}>
            <PaperPlane size="lg" nostroke />
            Invites
          </NavItem>
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
  const isCurrentPage = location.pathname === path;

  return (
    <Link
      as={NavLink}
      to={path}
      css={{
        fontSize: '$h2',
        '&:hover': {
          background: '$surfaceNested',
        },
        color: isCurrentPage ? '$cta' : '$navLinkText',
        background: isCurrentPage ? '$surfaceNested' : 'transparent',
        p: '$sm $md',
        display: 'flex',
        gap: '$md',
        alignItems: 'center',
        borderRadius: '$3',
        path: {
          fill: isCurrentPage ? '$cta' : '$navLinkText',
        },
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
