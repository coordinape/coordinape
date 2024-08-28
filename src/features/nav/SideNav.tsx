import { Suspense, useEffect, useState } from 'react';

import { CoSoulPromoModal } from 'features/cosoul/CoSoulPromoModal';
import {
  getCoSoulData,
  QUERY_KEY_COSOUL_PAGE,
} from 'features/cosoul/getCoSoulData';
import { pulse } from 'keyframes';
import { useQuery } from 'react-query';
import { NavLink, useLocation } from 'react-router-dom';

import {
  coSoulPaths,
  getCircleFromPath,
  getOrgFromPath,
} from '../../routes/paths';
import HelpButton from 'components/HelpButton';
import { Menu, X } from 'icons/__generated';
import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { Button, Flex, IconButton } from 'ui';

import { NavCircle, NavOrg, useNavQuery } from './getNavData';
import { NavCircles } from './NavCircles';
import { NavLogo } from './NavLogo';
import { NavOrgs } from './NavOrgs';
import { NavProfile } from './NavProfile';

export const pulseStyles = {
  content: '',
  zIndex: -1,
  borderRadius: '$2',
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: '$cta',
  animation: `${pulse} 3s linear infinite`,
  pointerEvents: 'none',
};

export const SideNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentCircle, setCurrentCircle] = useState<NavCircle | undefined>(
    undefined
  );
  const [currentOrg, setCurrentOrg] = useState<NavOrg | undefined>(undefined);

  const location = useLocation();
  const { data } = useNavQuery();

  const address = data?.profile.address;
  const profileId = data?.profile.id;

  const query = useQuery(
    [QUERY_KEY_COSOUL_PAGE, profileId, address],
    () => getCoSoulData(profileId, address as string),
    {
      enabled: !!profileId && !!address,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const cosoul_data = query.data;

  const cosoulCtaClick = () => {
    window.localStorage.setItem('cosoulCtaAnimation', 'hidden');
  };
  const suppressCosoulCtaAnimation =
    cosoul_data?.mintInfo ||
    window.localStorage.getItem('cosoulCtaAnimation') === 'hidden';

  const setCircleAndOrgIfMatch = (orgs: NavOrg[]) => {
    const circleId = getCircleFromPath(location);
    const orgId = getOrgFromPath(location);

    for (const o of orgs) {
      if (circleId) {
        for (const c of [...o.myCircles, ...o.otherCircles]) {
          if (c.id == +circleId) {
            setCurrentCircle(c);
            setCurrentOrg(o);
            return;
          }
        }
      }
      setCurrentCircle(undefined);
      if (orgId && o.id == +orgId) {
        setCurrentOrg(o);
        return;
      }
      setCurrentOrg(undefined);
    }
  };

  useEffect(() => {
    if (data) {
      if (data.organizations) {
        setCircleAndOrgIfMatch(data.organizations);
      }
    }
  }, [data, location]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <Flex
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
        className="navLogoContainer"
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
        <NavLogo />
        <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size="lg" /> : <Menu size="lg" />}
        </IconButton>
      </Flex>
      <Flex
        column
        css={{
          justifyContent: 'space-between',
          height: `calc(100% - $xl)`,
          '@sm': { height: '100%' },
        }}
      >
        <Flex
          column
          css={{
            flex: 1,
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
          }}
        >
          {data && (
            <>
              <NavOrgs
                orgs={data.organizations}
                currentOrg={currentOrg}
                currentCircle={currentCircle}
              />
              {currentOrg && (
                <NavCircles org={currentOrg} currentCircle={currentCircle} />
              )}
            </>
          )}
        </Flex>
        <Flex column css={{ position: 'relative' }}>
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
          {data && (
            <>
              <Flex column css={{ gap: '$sm' }}>
                {address && <EmailCTA />}
                <>
                  <Button
                    color="cta"
                    size="xs"
                    as={NavLink}
                    onClick={() => cosoulCtaClick()}
                    css={{
                      zIndex: 3,
                      position: 'relative',
                      '&:before': {
                        ...pulseStyles,
                        animationDelay: '3s',
                        display: suppressCosoulCtaAnimation ? 'none' : 'block',
                      },
                      '&:after': {
                        ...pulseStyles,
                        animationDelay: '1.5s',
                        zIndex: -1,
                        display: suppressCosoulCtaAnimation ? 'none' : 'block',
                      },
                    }}
                    to={
                      cosoul_data?.mintInfo
                        ? coSoulPaths.cosoulView(`${data?.profile.address}`)
                        : coSoulPaths.cosoul
                    }
                  >
                    {cosoul_data?.mintInfo ? 'View ' : 'Mint '}
                    Your CoSoul NFT
                  </Button>
                  <CoSoulPromoModal minted={!!cosoul_data?.mintInfo} />
                </>
              </Flex>
              <Suspense fallback={null}>
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
                      background:
                        'linear-gradient(transparent, $navBackground)',
                      width: 'calc(100% + 6px)',
                      height: '100px',
                      top: '-103px',
                      left: '-3px',
                      pointerEvents: 'none',
                      zIndex: '2',
                    },
                  }}
                >
                  <NavProfile
                    name={data.profile.name}
                    avatar={data.profile.avatar}
                    hasCoSoul={!!data.profile.cosoul}
                  />
                </Flex>
              </Suspense>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
