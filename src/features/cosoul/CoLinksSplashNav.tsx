import { useEffect, useRef, useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { NavItem } from 'features/nav/NavItem';
import { NavLink } from 'react-router-dom';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { coLinksPaths } from '../../routes/paths';
import { useCoLinksNavQuery } from '../colinks/useCoLinksNavQuery';
import { Network } from 'components';
import { Avatar, Box, Button, Flex, Text } from 'ui';
import { shortenAddressWithFrontLength } from 'utils';

export const CoLinksSplashNav = () => {
  const { chainId, logout } = useWalletStatus();
  const { data } = useCoLinksNavQuery();
  const address = useConnectedAddress();
  const [open, setOpen] = useState(false);
  const name = data?.profile.name;
  const avatar = data?.profile.avatar;
  const NavProfileWidth = '165px';

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);
  return (
    <Flex
      row
      alignItems="center"
      css={{
        gap: '$lg',
        position: 'relative',
        justifyContent: 'flex-end',
      }}
    >
      {address ? (
        <Flex css={{ gap: '$md' }}>
          <Button as={NavLink} to={coLinksPaths.launch} color="coLinksCta">
            Launch CoLinks
          </Button>
          <Flex
            css={{
              minHeight: '$2xl',
              width: `calc(${NavProfileWidth} * 1.2)`,
              position: 'relative',
              '@sm': {
                width: `${NavProfileWidth}`,
              },
            }}
          >
            <Flex
              ref={ref}
              column
              css={{
                color: 'inherit',
                border: '1px solid $coLinks',
                background: '$surface',
                borderRadius: '$3',
                width: '100%',
                position: 'absolute',
                right: 0,
                '&:hover': {
                  borderColor: '$coLinksCta',
                },
              }}
            >
              <Flex
                row
                as={Button}
                color="transparent"
                css={{
                  minHeight: '$2xl',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  color: '$navLinkText',
                  cursor: 'pointer',
                  padding: '$xs $sm',
                  borderRadius: '$3',
                  borderBottomLeftRadius: open ? 0 : '$3',
                  borderBottomRightRadius: open ? 0 : '$3',
                  borderBottom: open
                    ? '1px dashed $border'
                    : '1px dashed transparent',
                  // '&:hover': {
                  //   background: '$dim',
                  // },
                }}
                tabIndex={0}
                onClick={() => setOpen(prev => !prev)}
              >
                <Flex css={{ alignItems: 'flex-start' }}>
                  <Avatar
                    name={name}
                    size="small"
                    margin="none"
                    css={{
                      mr: '$sm',
                    }}
                    path={avatar}
                  />
                </Flex>
                <Box css={{ minWidth: 0 }}>
                  {address && (
                    <Text size="small" ellipsis>
                      {shortenAddressWithFrontLength(address, 4)}
                    </Text>
                  )}
                  <Text
                    color="neutral"
                    css={{
                      svg: { display: 'none' },
                    }}
                  >
                    <Network chainId={chainId || 1} />
                  </Text>
                </Box>
              </Flex>
              {open && (
                <Box css={{ mt: '$sm', pr: '$xs', mb: '$xs' }}>
                  <NavItem
                    label="Disconnect"
                    to={`${coLinksPaths.root}?`}
                    onClick={logout}
                  />
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${coLinksPaths.launch}`}
          color="coLinksCta"
          size="large"
          css={{
            width: `calc(${NavProfileWidth} * 1.2)`,
            '@sm': {
              width: `${NavProfileWidth}`,
            },
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
