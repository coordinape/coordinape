import { NavLink } from 'react-router-dom';

import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
});

// an alternative to this is <Link as={NavLink}>
export const AppLink = styled(NavLink, {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
});
