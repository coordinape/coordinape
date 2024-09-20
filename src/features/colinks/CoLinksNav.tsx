import { memo, useContext, useEffect, useState } from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { CoLogoMark } from 'features/nav/CoLogoMark';
import { GiveAvailablePopover } from 'features/points/GiveAvailablePopover';
import { PointsBar } from 'features/points/PointsBar';
import { PointsBarInfo } from 'features/points/PointsBarInfo';
import { usePoints } from 'features/points/usePoints';
import { useLocation } from 'react-router';
import { NavLink, useNavigate } from 'react-router-dom';

import { isFeatureEnabled } from '../../config/features';
import { moveBg } from '../../keyframes';
import { coLinksPaths } from '../../routes/paths';
import {
  Button,
  Flex,
  HR,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '../../ui';
import { NavLogo } from '../nav/NavLogo';
import { useNotificationCount } from '../notifications/useNotificationCount';
import { CoLinksSearchBox } from '../SearchBox/CoLinksSearchBox';
import HelpButton from 'components/HelpButton';
import {
  Ai,
  BoltFill,
  CertificateFill,
  Gear,
  GemCoFillSm,
  GemCoOutline,
  HouseFill,
  Menu,
  MessagesQuestion,
  PaperPlane,
  PlanetFill,
  UserFill,
  X,
} from 'icons/__generated';

import { CoLinksContext } from './CoLinksContext';
import { CoLinksNavProfile } from './CoLinksNavProfile';
import { useCoLinksNavQuery } from './useCoLinksNavQuery';

type NavData = ReturnType<typeof useCoLinksNavQuery>['data'];

export const CoLinksNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data } = useCoLinksNavQuery();
  const { address } = useContext(CoLinksContext);
  const location = useLocation();
  const { give } = usePoints();

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
        '@md': { width: '260px' },
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
            p: '$md',
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
          <NavLogo loggedIn={!!address} />
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
        <GiveAvailablePopover />
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
          overflow: 'auto',
        }}
      >
        <Flex
          css={{
            gap: '$xs',
          }}
          column
        >
          <Flex css={{ mb: '$lg' }}>
            <CoLinksSearchBox />
          </Flex>
          {address ? (
            <LoggedInItems data={data} address={address} />
          ) : (
            <LoggedOutItems />
          )}
        </Flex>
      </Flex>
      <Flex column>
        {data && (
          <Flex
            column
            css={{
              mt: '$sm',
              mb: '$lg',
              width: '100%',
              position: 'relative',
              gap: '$md',
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
            {mobileMenuOpen && (
              <HelpButton
                css={{
                  top: 20,
                  right: -40,
                  position: 'absolute',
                  display: 'none',
                  '@sm': {
                    display: 'block',
                  },
                  '.helpButtonContainer': {
                    position: 'absolute',
                  },
                }}
              />
            )}
            <Flex column>
              <Flex css={{ justifyContent: 'space-between' }}>
                <Flex>
                  <Text semibold size="small">
                    GIVE Bar
                  </Text>
                  <Popover>
                    <PopoverTrigger css={{ cursor: 'pointer' }}>
                      <IconButton>
                        <InfoCircledIcon />
                      </IconButton>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      css={{ maxWidth: 300, overflow: 'clip' }}
                    >
                      <PointsBarInfo />
                    </PopoverContent>
                  </Popover>
                </Flex>
                <Text size="small" semibold color="link">
                  {give}
                  <GemCoOutline fa css={{ ml: '$xs' }} />
                </Text>
              </Flex>
              <PointsBar barOnly />
            </Flex>
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
  className,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const isCurrentPage = location.pathname === path;

  return (
    <Link
      className={className}
      as={NavLink}
      to={path}
      css={{
        fontSize: '$h2',
        '&:hover': {
          background: '$navLinkHoverBackground',
        },
        color: isCurrentPage ? '$navLinkActiveText' : '$navLinkText',
        background: isCurrentPage ? '$navLinkActiveBackground' : 'transparent',
        p: '$sm $md',
        display: 'flex',
        gap: '$md',
        alignItems: 'center',
        borderRadius: '$3',
        path: {
          fill: isCurrentPage ? '$navLinkActiveText' : '$navLinkText',
        },
      }}
    >
      {children}
    </Link>
  );
};

const Count = memo(function Count() {
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
        minWidth: '20px',
        height: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {count}
    </Text>
  ) : null;
});

const LoggedInItems = ({
  data,
  address,
}: {
  data: NavData;
  address: string | undefined;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <NavItem path={coLinksPaths.home}>
        <HouseFill size="lg" nostroke />
        Home
      </NavItem>
      {isFeatureEnabled('give_zone') && (
        <NavItem path={coLinksPaths.give}>
          <GemCoFillSm size="lg" nostroke />
          GIVE
        </NavItem>
      )}
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
      <NavItem
        className="spicy"
        path={
          data?.big_question
            ? coLinksPaths.bigQuestion(data.big_question.id)
            : coLinksPaths.bigQuestions
        }
      >
        <MessagesQuestion size="lg" nostroke />
        <Flex
          css={{
            '--bg-size': '400%',
            '--color-one': '$colors$bigQuestion1',
            '--color-two': '$colors$bigQuestion2',
            background:
              'linear-gradient(90deg,var(--color-one),var(--color-two),var(--color-one)) 0 0 / var(--bg-size) 100%',
            color: 'transparent',
            backgroundClip: 'text',
            '-webkit-background-clip': 'text',
            animation: `${moveBg} 32s infinite linear`,
            '&:hover': {
              outline: '$surfaceNested',
            },
          }}
        >
          The Big Question
        </Flex>
      </NavItem>
      <HR />
      <NavItem path={address ? coLinksPaths.profileGive(address) : ''}>
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
                path: { fill: '$linkHover' },
              },
            }}
            onClick={e => {
              e.preventDefault();
              navigate(coLinksPaths.account);
            }}
          >
            <Gear fa />
          </IconButton>
        </Flex>
      </NavItem>
      <NavItem path={address ? coLinksPaths.profileReputation(address) : ''}>
        <CertificateFill size="lg" nostroke />
        Rep Score
      </NavItem>
      <NavItem path={coLinksPaths.invites}>
        <PaperPlane size="lg" nostroke />
        Invites
      </NavItem>
    </>
  );
};
const LoggedOutItems = () => {
  const { openConnectModal, connectModalOpen } = useConnectModal();

  return (
    <>
      {/* <NavItem path={coLinksPaths.home}> */}
      {/*   <HouseFill size="lg" nostroke /> */}
      {/*   Home */}
      {/* </NavItem> */}
      <NavItem path={coLinksPaths.explore}>
        <PlanetFill size="lg" nostroke />
        Explore
      </NavItem>
      {/* <NavItem path={coLinksPaths.highlights}> */}
      {/*   <Ai size="lg" nostroke /> */}
      {/*   Highlights */}
      {/* </NavItem> */}
      {/* <NavItem */}
      {/*   className="spicy" */}
      {/*   path={ */}
      {/*     data?.big_question */}
      {/*       ? coLinksPaths.bigQuestion(data.big_question.id) */}
      {/*       : coLinksPaths.bigQuestions */}
      {/*   } */}
      {/* > */}
      {/*   <MessagesQuestion size="lg" nostroke /> */}
      {/*   <Flex */}
      {/*     css={{ */}
      {/*       '--bg-size': '400%', */}
      {/*       '--color-one': '$colors$success', */}
      {/*       '--color-two': '$colors$cta', */}
      {/*       background: */}
      {/*         'linear-gradient(90deg,var(--color-one),var(--color-two),var(--color-one)) 0 0 / var(--bg-size) 100%', */}
      {/*       color: 'transparent', */}
      {/*       backgroundClip: 'text', */}
      {/*       '-webkit-background-clip': 'text', */}
      {/*       animation: `${moveBg} 32s infinite linear`, */}
      {/*       '&:hover': { */}
      {/*         outline: '$surfaceNested', */}
      {/*       }, */}
      {/*     }} */}
      {/*   > */}
      {/*     The Big Question */}
      {/*   </Flex> */}
      {/* </NavItem> */}
      <HR />
      <Button
        onClick={() => {
          if (openConnectModal && !connectModalOpen) openConnectModal();
        }}
        disabled={connectModalOpen}
        color="cta"
      >
        Login or Join CoLinks
      </Button>
    </>
  );
};
