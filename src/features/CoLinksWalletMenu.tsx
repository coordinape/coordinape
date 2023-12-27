import { useEffect, useRef, useState } from 'react';

import { CSS } from '@stitches/react';

import { Network } from 'components';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { ChevronDown } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Box, Button, Flex, Text } from 'ui';
import { shortenAddressWithFrontLength } from 'utils';

import { useWalletStatus } from './auth';
import { useCoLinksNavQuery } from './colinks/useCoLinksNavQuery';
import { MagicLinkWallet } from './magiclink/MagicLinkWallet';
import { NavItem } from './nav/NavItem';

export const NavProfileWidth = '165px';

export const CoLinksWalletMenu = ({
  css,
  inline,
}: {
  css?: CSS;
  inline?: boolean;
}) => {
  const { chainId, logout } = useWalletStatus();
  const { data } = useCoLinksNavQuery();
  const address = useConnectedAddress();
  const [open, setOpen] = useState(false);
  const name = data?.profile.name;
  const avatar = data?.profile.avatar;

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
    <>
      {address && (
        <Flex
          css={{
            minHeight: inline ? '$lg' : '$2xl',
            width: inline ? '100%' : `calc(${NavProfileWidth} * 1.2)`,
            position: 'relative',
            '@sm': {
              width: inline ? '100%' : `${NavProfileWidth}`,
            },
            ...css,
          }}
        >
          <Flex
            ref={ref}
            column
            css={{
              color: 'inherit',

              borderRadius: '$3',
              width: '100%',
              position: 'absolute',
              right: 0,
              '&:hover': {
                borderColor: '$coLinksCta',
              },
              ...(inline
                ? { background: '$surfaceNested', border: 'none' }
                : {
                    background: '$surface',
                    border: '1px solid $coLinks',
                  }),
            }}
          >
            <Flex
              row
              as={Button}
              color="transparent"
              css={{
                minHeight: inline ? '$lg' : '$2xl',
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
              {!inline && (
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
              )}
              <Flex
                css={{
                  flexDirection: inline ? 'row' : 'column',
                  columnGap: '$md',
                  minWidth: 0,
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Flex
                  css={{
                    flexDirection: inline ? 'row' : 'column',
                    columnGap: '$md',
                    minWidth: 0,
                    width: '100%',
                  }}
                >
                  {address && (
                    <Text
                      ellipsis
                      css={{
                        fontFamily: 'monospace',
                        fontSize: '$xs !important',
                      }}
                    >
                      {shortenAddressWithFrontLength(address, inline ? 6 : 4)}
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
                </Flex>
                {inline && <ChevronDown color="neutral" />}
              </Flex>
            </Flex>
            {open && (
              <Box css={{ mt: '$sm', pr: '$xs', mb: '$xs' }}>
                <MagicLinkWallet />
                <NavItem
                  label="Disconnect"
                  to={`${coLinksPaths.root}?`}
                  onClick={logout}
                />
              </Box>
            )}
          </Flex>
        </Flex>
      )}
    </>
  );
};
