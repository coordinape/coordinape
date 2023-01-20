import { NavLink } from 'react-router-dom';

import { CSS } from '../../stitches.config';
import { Text } from '../../ui';

export const NavClaimsButton = ({ css }: { css?: CSS }) => {
  return (
    <Text
      tag
      as={NavLink}
      to="/claims"
      css={{ ...css, textDecoration: 'none' }}
      color="complete"
      size="small"
    >
      Claim Tokens
    </Text>
  );
};
