import { NavLink } from 'react-router-dom';

import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$lightBlue',
  textDecoration: 'none',
});

// an alternative to this is <Link as={NavLink}>
export const AppLink = styled(NavLink, {
  color: '$lightBlue',
  textDecoration: 'none',
});
