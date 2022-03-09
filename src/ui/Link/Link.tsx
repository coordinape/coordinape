import { styled } from '../../stitches.config';

export const Link = styled('a', {
  color: '$lightBlue',
  textDecoration: 'none',
});

export const LinkWrapper = styled('span', {
  '> a': {
    color: '$lightBlue',
    textDecoration: 'none',
  },
});
