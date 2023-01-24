import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box } from '../../ui';

export const NavLogo = ({ css }: { css?: CSS }) => {
  return (
    <Box
      as={NavLink}
      to={paths.circles}
      css={{
        ...css,
        'img, svg': { width: '100%', maxWidth: '250px' },
        'svg *': { fill: 'white' },
      }}
    >
      <img src={'/imgs/logo/coordinape-logo-white.png'} alt="coordinape logo" />
      {/* <img src={'/imgs/logo/coordinape-logo.svg'} alt="coordinape logo" /> */}
    </Box>
  );
};
