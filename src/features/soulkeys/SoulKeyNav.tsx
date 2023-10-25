import { useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { chain } from 'features/cosoul/chains';
import { useLocation } from 'react-router';
import { NavLink } from 'react-router-dom';

import { Check, Menu, X, Square } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Flex, IconButton, Link, Panel, Text } from '../../ui';
import { useNavQuery } from '../nav/getNavData';
import { NavLogo } from '../nav/NavLogo';
import { useWeb3React } from 'hooks/useWeb3React';

import { SoulKeyNavProfile } from './SoulKeyNavProfile';

const Step = ({ label, test }: { label: string; test: boolean }) => {
  return (
    <Flex css={{ justifyContent: 'space-between' }}>
      <Text>{label}</Text>
      {test ? <Check color="complete" /> : <Square color="warning" />}
    </Flex>
  );
};

export const SoulKeyNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data } = useNavQuery();
  const name = data?.profile.name;
  const { chainId } = useWeb3React();
  const { address } = useWalletStatus();
  const onCorrectChain = chainId === Number(chain.chainId);
  const hasName = name && !name.startsWith('New User') && !!address;
  const hasCoSoul = !!data?.profile.cosoul;

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
        <Flex css={{ gap: '$md', alignItems: 'center' }}>
          <NavLogo />
        </Flex>
        <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size="lg" /> : <Menu size="lg" />}
        </IconButton>
      </Flex>
      <Flex
        css={{
          gap: '$xs',
          py: '$md',
        }}
      >
        <Text
          h1
          css={{
            fontSize: '80px',
            lineHeight: 0,
            transform: 'rotateY(180deg)',
          }}
        >
          🦭
        </Text>
        <Flex column css={{ '*': { fontFamily: 'monospace' } }}>
          <Text h1 color="neutral">
            s0uL
          </Text>
          <Text h1 color="neutral">
            k3yZ
          </Text>
        </Flex>
        <Text h1 css={{ fontSize: '80px', lineHeight: 0 }}>
          🦭
        </Text>
      </Flex>
      {/*<Image*/}
      {/*  alt="SoulKeys"*/}
      {/*  css={{ width: 64, flexShrink: 0, alignSelf: 'center' }}*/}
      {/*  src={'/imgs/soulkeys/soulkeys.png'}*/}
      {/*/>*/}

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
        <Text variant="label">Get Started</Text>
        <Panel nested css={{ gap: '$sm' }}>
          <Step label="Connect Wallet" test={!!address} />
          <Step label="On Optimism" test={chain && onCorrectChain} />
          <Step label="CoSoul" test={hasCoSoul} />
          <Step label="Connect Rep" test={false} />
          <Step label="Name" test={hasName} />
          <Step label="Buy Your Own Link" test={false} />
          <Step label="Buy Other Links" test={false} />
          <Step label="Create Some Content" test={false} />
        </Panel>
        <Flex
          css={{
            gap: '$md',
            p: '$lg',
            mr: '$lg',
          }}
          column
        >
          <NavItem path={paths.soulKeys}>Your SoulKey</NavItem>
          <NavItem path={paths.soulKeysActivity}>Activity Stream</NavItem>
          {/*<NavItem path={paths.soulKeysTrades}>Trade Stream</NavItem>*/}
          <NavItem path={paths.soulKeysExplore}>Explore Souls</NavItem>
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
            <SoulKeyNavProfile
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
  return (
    <Link
      as={NavLink}
      to={path}
      css={{ fontWeight: location.pathname === path ? '$semibold' : undefined }}
    >
      {children}
    </Link>
  );
};
