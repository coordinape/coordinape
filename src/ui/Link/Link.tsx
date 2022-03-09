import { Link as RRLink } from 'react-router-dom';

import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$lightBlue',
  textDecoration: 'none',
});

export const AppLink = styled(RRLink, {
  color: '$lightBlue',
  textDecoration: 'none',
});
