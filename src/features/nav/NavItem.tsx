import * as React from 'react';

import { NavLink } from 'react-router-dom';

import { styled } from '../../stitches.config';
import { Box, Button, Flex } from '../../ui';

export const NavItem = ({
  label,
  to,
  icon,
}: {
  label: string;
  to: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Box>
      <Button color="transparent">
        <NavLinkItem to={to}>
          <Flex css={{ alignItems: 'center' }}>
            {icon && icon}
            <Flex css={{ marginLeft: 8 }}>{label}</Flex>
          </Flex>
        </NavLinkItem>
      </Button>
    </Box>
  );
};

const NavLinkItem = styled(NavLink, {
  color: '$text',
  textDecoration: 'none',
  cursor: 'pointer',
});
