import { CSS } from '../../stitches.config';
import { Box } from '../../ui';

export const NavLogo = ({ css }: { css?: CSS }) => {
  return (
    <Box css={{ ...css, 'svg *': { fill: 'white' } }}>
      <img src={'/imgs/logo/coordinape-logo-white.png'} alt="coordinape logo" />
    </Box>
  );
};
