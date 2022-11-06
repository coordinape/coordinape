import { NavLink } from 'react-router-dom';
import { styled } from 'stitches.config';

const COMPOSERS = {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
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
    color: {
      text: {
        color: '$text',
      },
      neutral: {
        color: '$neutral',
      },
    },
  },
};

export const Link = styled('a', COMPOSERS);

export type LinkColorVariants =
  | keyof typeof COMPOSERS['variants']['color']
  | undefined;

export type LinkTypeVariants =
  | keyof typeof COMPOSERS['variants']['type']
  | undefined;

// an alternative to this is <Link as={NavLink}>
export const AppLink = styled(NavLink, {
  color: '$link',
  textDecoration: 'none',
  cursor: 'pointer',
});
