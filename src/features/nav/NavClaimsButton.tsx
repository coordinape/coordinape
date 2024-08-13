import { NavLink } from 'react-router-dom';

import { CSS } from '../../stitches.config';
import { Button } from '../../ui';
import { givePaths } from 'routes/paths';

export const NavClaimsButton = ({ css }: { css?: CSS }) => {
  return (
    <Button
      as={NavLink}
      to={givePaths.claims}
      css={{ ...css, textDecoration: 'none', zIndex: 3 }}
      color="neutral"
      size="xs"
    >
      Claim Tokens
    </Button>
  );
};
