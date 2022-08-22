import { NavLink, useLocation } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { Box, Link } from 'ui';

export const TopLevelLinks = ({
  links,
  css = {},
}: {
  links: [string, string, string[]?][];
  css?: CSS;
}) => {
  const location = useLocation();

  return (
    <Box
      css={{
        display: 'flex',
        '@sm': {
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
        ...css,
      }}
    >
      {links.map(([path, label, matchPaths]) => (
        <Link
          css={navLinkStyle}
          as={NavLink}
          key={path}
          to={path}
          className={matchPaths?.includes(location.pathname) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </Box>
  );
};

export const navLinkStyle = {
  my: 0,
  mr: '$xs',
  fontSize: '$large',
  color: '$white',
  borderRadius: '$pill',
  textDecoration: 'none',
  px: '$md',
  py: '$sm',
  position: 'relative',
  border: '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '$secondaryText',
  },
  '&.active': {
    backgroundColor: '$borderMedium',
    fontWeight: '$bold',
    color: '$text',
  },
  '@sm': {
    position: 'unset',
    color: '$text',
    fontWeight: 'normal',
    '&:hover': {
      color: '$black',
      '&::after': {
        content: 'none',
      },
    },
    '&.active': {
      color: '$alert',
      '&::after': {
        content: 'none',
      },
    },
  },
};
