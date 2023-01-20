import React, { useState } from 'react';

import { Network } from '../../components';
import { useMyProfile } from '../../recoilState';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, Text } from '../../ui';
import { useWalletStatus } from '../auth';
import { ThemeSwitcher } from '../theming/ThemeSwitcher';

import { NavItem } from './NavItem';

export const NavProfile = () => {
  const profile = useMyProfile();
  const [open, setOpen] = useState(false);
  const { chainId, logout } = useWalletStatus();

  return (
    <Flex
      column
      css={{
        color: 'inherit',
        border: '1px solid $borderFocus',
        borderRadius: '$3',

        width: '100%',
      }}
    >
      <Flex
        css={{
          justifyContent: 'flex-start',
          color: '$navLinkText',
          cursor: 'pointer',
          padding: '$xs $sm',
          borderRadius: '$3',
          '&:hover, &:focus': {
            backgroundColor: '$highlight',
            filter: 'saturate(1)',
          },
        }}
        onClick={() => setOpen(prev => !prev)}
      >
        <Avatar
          name={profile.name}
          size="small"
          margin="none"
          css={{
            mr: '$sm',
          }}
          path={profile.avatar}
        />
        <Box css={{ minWidth: 0 }}>
          <Text color="inherit" semibold>
            {profile.name}
          </Text>
          <Text color="inherit" size="small" ellipsis>
            {profile.address}
          </Text>
        </Box>
      </Flex>
      {open && (
        <Box css={{ mt: '$sm' }}>
          <NavItem
            label="Profile"
            to={paths.profile('me')}
            onClick={() => setOpen(false)}
          />
          <NavItem
            label="Claims"
            to={paths.claims}
            onClick={() => setOpen(false)}
          />
          <NavItem label="Disconnect" to="/" onClick={logout} />
          <ThemeSwitcher />
          <Text
            tag
            color="neutral"
            css={{
              margin: '$sm',
              'svg *': { fill: '$navLinkText' },
            }}
          >
            <Network chainId={chainId || 1} />
          </Text>
        </Box>
      )}
    </Flex>
  );
};
