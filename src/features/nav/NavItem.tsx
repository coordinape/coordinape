import * as React from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { Box, Button, Flex, Text } from '../../ui';

export const NavItem = ({
  label,
  to,
  icon,
  onClick,
}: {
  label: React.ReactNode;
  to: string;
  icon?: React.ReactNode;
  onClick?(): void;
}) => {
  const location = useLocation();

  return (
    <Box css={{ ml: '$xs', mb: '$xs' }} onClick={onClick}>
      <Button
        className={location.pathname == to ? 'currentPage' : undefined}
        as={NavLink}
        color="navigation"
        to={to}
        fullWidth
        css={{ py: '$sm', pl: '$sm' }}
      >
        <Flex
          css={{
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
          }}
        >
          {icon && icon}
          <Text
            color="inherit"
            css={{
              display: 'flex',
              ml: icon ? '$sm' : undefined,
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            {label}
          </Text>
        </Flex>
      </Button>
    </Box>
  );
};
