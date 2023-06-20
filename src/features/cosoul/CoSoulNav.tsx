import { useEffect, useRef, useState } from 'react';

import { useWalletStatus } from 'features/auth';
import { useNavQuery } from 'features/nav/getNavData';
import { NavItem } from 'features/nav/NavItem';
import { NavLink } from 'react-router-dom';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import { Network } from 'components';
import { EXTERNAL_URL_DOCS, paths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Text } from 'ui';
import { shortenAddressWithFrontLength } from 'utils';

export const CoSoulNav = () => {
  const { chainId, logout } = useWalletStatus();
  const { data } = useNavQuery();
  const address = useConnectedAddress();
  const [open, setOpen] = useState(false);
  const name = data?.profile.name;
  const avatar = data?.profile.avatar;
  const NavProfileWidth = '165px';
  const hasCoSoul = true;

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
              border: '1px solid $borderFocus',
              background: '$surface',
              borderRadius: '$3',
              width: '100%',
              position: 'absolute',
              right: 0,
              '&:hover': {
                borderColor: '$borderFocusBright',
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
                {hasCoSoul && (
                  <NavItem label="View CoSoul" to={paths.cosoulView(address)} />
                )}
                <NavItem label="About CoSoul" to={paths.cosoul} />
                <NavItem label="Docs" to={`//${EXTERNAL_URL_DOCS}`} />
                <NavItem
                  label="Disconnect"
                  to={`${paths.cosoul}?`}
                  onClick={logout}
                />
              </Box>
            )}
          </Flex>
        </Flex>
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${location.pathname}`}
          color="cta"
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
