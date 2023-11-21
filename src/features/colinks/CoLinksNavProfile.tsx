import React, { useEffect, useRef, useState } from 'react';

import { NavItem } from 'features/nav/NavItem';

import { Network } from '../../components';
import { paths } from '../../routes/paths';
import { Avatar, Box, Button, Flex, Text } from '../../ui';
import { useWalletStatus } from '../auth';
import { MagicLinkWallet } from '../magiclink/MagicLinkWallet';
import { ThemeSwitcher } from '../theming/ThemeSwitcher';
import { shortenAddressWithFrontLength } from 'utils';

export const CoLinksNavProfile = ({
  name,
  avatar,
  hasCoSoul,
}: {
  name: string | undefined;
  avatar: string | undefined;
  hasCoSoul: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { chainId, logout, address } = useWalletStatus();

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
      ref={ref}
      column
      css={{
        color: 'inherit',
        border: '1px solid $border',
        borderRadius: '$3',
        width: '100%',
      }}
    >
      <Flex
        row
        as={Button}
        color="transparent"
        css={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          color: '$navLinkText',
          cursor: 'pointer',
          padding: '$xs $sm',
          borderRadius: '$3',
          borderBottomLeftRadius: open ? 0 : '$3',
          borderBottomRightRadius: open ? 0 : '$3',
          borderBottom: open ? '1px dashed $border' : 'none',
          '&:hover': {
            background: '$dim',
          },
        }}
        tabIndex={0}
        onClick={() => setOpen(prev => !prev)}
      >
        <Avatar
          name={name}
          size="small"
          margin="none"
          css={{
            mr: '$sm',
            mt: '$xs',
          }}
          path={avatar}
          hasCoSoul={hasCoSoul}
        />
        <Box css={{ minWidth: 0 }}>
          <Text semibold ellipsis>
            {name}
          </Text>
          <Text size="small" ellipsis>
            {address && shortenAddressWithFrontLength(address, 4)}
          </Text>
          {open && (
            <Text
              color="neutral"
              css={{
                svg: { display: 'none' },
              }}
            >
              <Network chainId={chainId || 1} />
            </Text>
          )}
        </Box>
      </Flex>
      {open && (
        <Box css={{ mt: '$sm', pr: '$xs' }}>
          <NavItem
            label="Account"
            to={paths.coLinksAccount}
            onClick={() => setOpen(false)}
          />
          <NavItem
            label="Revisit Wizard"
            to={paths.coLinksWizard}
            onClick={() => setOpen(false)}
          />
          <MagicLinkWallet />
          <NavItem label="Disconnect" onClick={logout} />
          <ThemeSwitcher />
        </Box>
      )}
    </Flex>
  );
};
