import { useContext } from 'react';

import { CSS } from '../../stitches.config';
import { Box } from '../../ui';
import { ThemeContext } from '../theming/ThemeProvider';

export const NavLogo = ({ navOpen, css }: { navOpen: boolean; css?: CSS }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box css={css}>
      <img
        src={
          theme == 'light'
            ? navOpen
              ? '/imgs/logo/coordinape-logo-black.png'
              : '/imgs/logo/coordinape-mark-black.png'
            : navOpen
            ? '/imgs/logo/coordinape-logo-white.png'
            : '/imgs/logo/coordinape-mark-white.png'
        }
        alt="coordinape word mark"
      />
    </Box>
  );
};
