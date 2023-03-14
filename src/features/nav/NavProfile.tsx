import React, { useEffect, useRef, useState } from 'react';

import { Network } from '../../components';
import { CreateUserNameForm } from '../../components/MainLayout/CreateUserNameForm';
import { paths } from '../../routes/paths';
import { Avatar, Box, Button, Flex, Modal, Text } from '../../ui';
import { useWalletStatus } from '../auth';
import { ThemeSwitcher } from '../theming/ThemeSwitcher';
import { RecentTransactionsModal } from 'components/RecentTransactionsModal';
import isFeatureEnabled from 'config/features';
import { shortenAddressWithFrontLength } from 'utils';

import { NavItem } from './NavItem';

export const NavProfile = ({
  name,
  avatar,
}: {
  name: string | undefined;
  avatar: string | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const { chainId, logout, address } = useWalletStatus();
  const showNameForm = (!name || name.startsWith('New User')) && !!address;

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
            label="Profile"
            to={paths.profile('me')}
            onClick={() => setOpen(false)}
          />
          {isFeatureEnabled('vaults') && (
            <>
              <NavItem
                label="Recent Transactions"
                to="/"
                onClick={() => setShowTxModal(true)}
              />
              {showTxModal && (
                <RecentTransactionsModal
                  onClose={() => setShowTxModal(false)}
                />
              )}
            </>
          )}
          <NavItem
            label="Claims"
            to={paths.claims}
            onClick={() => setOpen(false)}
          />
          <NavItem label="Disconnect" to="/" onClick={logout} />
          <ThemeSwitcher />
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
