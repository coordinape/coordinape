import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box } from '../../ui';

export const NavLogo = ({ css }: { css?: CSS }) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Box
          as={NavLink}
          to={paths.circles}
          css={{
            ...css,
            'img, svg': {
              width: '65%',
              minWidth: '140px',
              filter: theme == 'light' ? 'invert(1) opacity(0.6)' : 'unset',
              '@sm': {
                maxWidth: '140px',
              },
            },
            'svg *': { fill: 'white' },
          }}
        >
          <img
            src={'/imgs/logo/coordinape-logo-white.png'}
            alt="coordinape logo"
          />
          {/* <img src={'/imgs/logo/coordinape-logo.svg'} alt="coordinape logo" /> */}
        </Box>
      )}
    </ThemeContext.Consumer>
  );
};
