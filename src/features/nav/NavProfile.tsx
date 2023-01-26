import React, { useState } from 'react';

import { Network } from '../../components';
import { CreateUserNameForm } from '../../components/MainLayout/CreateUserNameForm';
import { paths } from '../../routes/paths';
import { Avatar, Box, Button, Flex, Modal, Text } from '../../ui';
import { useWalletStatus } from '../auth';
import { ThemeSwitcher } from '../theming/ThemeSwitcher';

import { NavItem } from './NavItem';

export const NavProfile = ({
  name,
  avatar,
}: {
  name: string | undefined;
  avatar: string | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const { chainId, logout, address } = useWalletStatus();
  const showNameForm = !name && !!address;

  return (
    <Flex
      column
      css={{
        color: 'inherit',
        border: '1px solid $neutral',
        borderRadius: '$3',
        width: '100%',
      }}
    >
      <Flex
        as={Button}
        color={'transparent'}
        css={{
          justifyContent: 'flex-start',
          color: '$navLinkText',
          cursor: 'pointer',
          padding: '$xs $sm',
          borderRadius: '$3',
          '&:hover, &:focus': {
            backgroundColor: '$dim',
            filter: 'saturate(1)',
          },
        }}
        tabIndex={0}
        onClick={() => setOpen(prev => !prev)}
        // onBlur={() => setOpen(false)}
      >
        <Avatar
          name={name}
          size="small"
          margin="none"
          css={{
            mr: '$sm',
          }}
          path={avatar}
        />
        <Box css={{ minWidth: 0 }}>
          <Text color="inherit" semibold>
            {name}
          </Text>
          <Text color="inherit" size="small" ellipsis>
            {address}
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
      {showNameForm && (
        <Modal open showClose={false} title="What's your name?">
          <CreateUserNameForm address={address} />
        </Modal>
      )}
    </Flex>
  );
};
