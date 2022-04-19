import { NavLink } from 'react-router-dom';

import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$lightBlue',
  textDecoration: 'none',
});

export const ExternalLink = styled(Link, {
  // color: '$blue',
  rel: 'noreferrer',
  target: '_blank',
});

// an alternative to this is <Link as={NavLink}>
export const AppLink = styled(NavLink, {
  color: '$lightBlue',
  textDecoration: 'none',
});
