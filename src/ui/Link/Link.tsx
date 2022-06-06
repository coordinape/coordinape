import { NavLink } from 'react-router-dom';

import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
  fontFamily: 'Inter',
  variants: {
    type: {
      menu: {
        fontSize: '$large',
        color: '$text',
        lineHeight: '$shorter',
        '&:hover': {
          color: '$link',
        },
      },
    },
  },
});

// an alternative to this is <Link as={NavLink}>
export const AppLink = styled(NavLink, {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
});
