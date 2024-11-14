import * as React from 'react';

import { NavLink, useLocation } from 'react-router-dom';

import { CSS } from '../../stitches.config';
import { Box, Button, Flex, Text, Link } from '../../ui';

export const NavItem = ({
  css,
  label,
  to,
  icon,
  onClick,
  external,
}: {
  css?: CSS;
  label: React.ReactNode;
  to?: string;
  icon?: React.ReactNode;
  onClick?(): void;
  external?: boolean;
}) => {
  const location = useLocation();

  // Determine the correct component to use and relevant props
  const Component = external ? Link : to ? NavLink : 'span';
  const linkProps = external ? { href: to } : { to };

  return (
    <Box css={{ ...css, ml: '$xs', mb: '$xs' }} onClick={onClick}>
      <Button
        className={location.pathname === to ? 'currentPage' : undefined}
        as={Component}
        color="navigation"
        {...linkProps} // Spread the appropriate props (`to` or `href`)
        fullWidth
        css={{
          py: '$sm',
          pl: '$sm',
          '@lg': {
            py: '$xs',
          },
        }}
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
